import '../../utility/format';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { JraRaceData } from '../../domain/jraRaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { JraRaceRecord } from '../../gateway/record/jraRaceRecord';
import {
    JraGradeType,
    JraRaceCourse,
    JraRaceCourseType,
} from '../../utility/data/jra';
import { Logger } from '../../utility/logger';
import { generateJraRaceId, JraRaceId } from '../../utility/raceId';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

@injectable()
export class JraRaceRepositoryFromStorageImpl
    implements IRaceRepository<JraRaceEntity, JraPlaceEntity>
{
    private readonly fileName = 'raceList.csv';

    constructor(
        @inject('JraRaceS3Gateway')
        private s3Gateway: IS3Gateway<JraRaceRecord>,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<JraPlaceEntity>,
    ): Promise<FetchRaceListResponse<JraRaceEntity>> {
        // 日付ごとのファイルから取得したレースデータ
        const raceEntityListFromOldFileList =
            await this.fetchRaceEntityListFromOldFileList(
                request.startDate,
                request.finishDate,
            );

        // ファイル名リストから海外競馬場開催データを取得する
        const raceRecordList: JraRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceRecordをRaceEntityに変換
        const newRaceEntityList: JraRaceEntity[] = raceRecordList.map(
            (raceRecord) => raceRecord.toEntity(),
        );

        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: JraRaceEntity[] =
            newRaceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= request.startDate &&
                    raceEntity.raceData.dateTime <= request.finishDate,
            );
        const raceEntityListFromNewFileList: JraRaceEntity[] =
            filteredRaceEntityList;

        // idに同じものがある場合は、raceEntityListFromNewFileListの方を採用する
        const raceEntityMap = new Map<string, JraRaceEntity>();

        // まず古いリストのデータをすべてマップに登録
        for (const race of raceEntityListFromOldFileList) {
            raceEntityMap.set(race.id, race);
        }

        // 新しいリストのデータで上書き
        for (const race of raceEntityListFromNewFileList) {
            raceEntityMap.set(race.id, race);
        }

        // マップの値を配列に変換して結果を取得
        const raceEntityList: JraRaceEntity[] = Array.from(
            raceEntityMap.values(),
        );

        return new FetchRaceListResponse<JraRaceEntity>(raceEntityList);
    }

    /**
     * 新ファイルリストからレースデータを取得する
     */
    private async getRaceRecordListFromS3(): Promise<JraRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(this.fileName);

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].replace('\r', '').split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf('id'),
            name: headers.indexOf('name'),
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            surfaceType: headers.indexOf('surfaceType'),
            distance: headers.indexOf('distance'),
            grade: headers.indexOf('grade'),
            number: headers.indexOf('number'),
            heldTimes: headers.indexOf('heldTimes'),
            heldDayTimes: headers.indexOf('heldDayTimes'),
        };

        // データ行を解析してRaceDataのリストを生成
        return lines
            .slice(1)
            .map((line: string) => {
                const columns = line.replace('\r', '').split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[indices.name] ||
                    isNaN(parseInt(columns[indices.number]))
                ) {
                    return undefined;
                }

                return new JraRaceRecord(
                    columns[indices.id] as JraRaceId,
                    columns[indices.name],
                    new Date(columns[indices.dateTime]),
                    columns[indices.location] as JraRaceCourse,
                    columns[indices.surfaceType] as JraRaceCourseType,
                    parseInt(columns[indices.distance]),
                    columns[indices.grade] as JraGradeType,
                    parseInt(columns[indices.number]),
                    parseInt(columns[indices.heldTimes]),
                    parseInt(columns[indices.heldDayTimes]),
                );
            })
            .filter(
                (raceData): raceData is JraRaceRecord => raceData !== undefined,
            )
            .filter(
                (raceData, index, self): raceData is JraRaceRecord =>
                    self.findIndex((data) => data.id === raceData.id) === index,
            );
    }

    /**
     * 旧ファイルリストからレースデータを取得する
     */
    private async fetchRaceEntityListFromOldFileList(
        startDate: Date,
        finishDate: Date,
    ): Promise<JraRaceEntity[]> {
        // startDateからfinishDateまでの日ごとのファイル名リストを生成する
        const fileNameList: string[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= finishDate) {
            const fileName = `race/${format(currentDate, 'yyyyMMdd')}.csv`;
            fileNameList.push(fileName);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // ファイル名リストから競馬場開催データを取得する
        const raceRecordList = (
            await Promise.all(
                fileNameList.map(async (fileName) => {
                    try {
                        const csv =
                            await this.s3Gateway.fetchDataFromS3(fileName);

                        // CSVを行ごとに分割
                        const lines = csv.split('\n');

                        // ヘッダー行を解析
                        const headers = lines[0].replace('\r', '').split(',');

                        // ヘッダーに基づいてインデックスを取得
                        const idIndex = headers.indexOf('id');
                        const raceNameIndex = headers.indexOf('name');
                        const raceDateIndex = headers.indexOf('dateTime');
                        const placeIndex = headers.indexOf('location');
                        const surfaceTypeIndex = headers.indexOf('surfaceType');
                        const distanceIndex = headers.indexOf('distance');
                        const gradeIndex = headers.indexOf('grade');
                        const raceNumIndex = headers.indexOf('number');
                        const heldTimesIndex = headers.indexOf('heldTimes');
                        const heldDayTimesIndex =
                            headers.indexOf('heldDayTimes');

                        // データ行を解析してJraRaceEntityのリストを生成
                        return (
                            lines
                                .slice(1)
                                .map((line: string) => {
                                    const columns = line
                                        .replace('\r', '')
                                        .split(',');

                                    // 必要なフィールドが存在しない場合はundefinedを返す
                                    if (
                                        !columns[raceNameIndex] ||
                                        isNaN(parseInt(columns[raceNumIndex]))
                                    ) {
                                        return undefined;
                                    }
                                    // idが存在しない場合はgenerateする
                                    const jraRaceId =
                                        columns[idIndex] === undefined ||
                                        columns[idIndex] === ''
                                            ? generateJraRaceId(
                                                  new Date(
                                                      columns[raceDateIndex],
                                                  ),
                                                  columns[
                                                      placeIndex
                                                  ] as JraRaceCourse,
                                                  parseInt(
                                                      columns[raceNumIndex],
                                                  ),
                                              )
                                            : (columns[idIndex] as JraRaceId);

                                    return new JraRaceRecord(
                                        jraRaceId,
                                        columns[raceNameIndex],
                                        new Date(columns[raceDateIndex]),
                                        columns[placeIndex] as JraRaceCourse,
                                        columns[
                                            surfaceTypeIndex
                                        ] as JraRaceCourseType,
                                        parseInt(columns[distanceIndex]),
                                        columns[gradeIndex] as JraGradeType,
                                        parseInt(columns[raceNumIndex]),
                                        parseInt(columns[heldTimesIndex]),
                                        parseInt(columns[heldDayTimesIndex]),
                                    );
                                })
                                .filter(
                                    (raceData): raceData is JraRaceRecord =>
                                        raceData !== undefined,
                                )
                                // IDが重複している場合は1つにまとめる
                                .reduce<JraRaceRecord[]>((acc, raceData) => {
                                    const index = acc.findIndex(
                                        (data) => data.id === raceData.id,
                                    );
                                    if (index === -1) {
                                        acc.push(raceData);
                                    }
                                    return acc;
                                }, [])
                        );
                    } catch (error) {
                        console.error(
                            `Error processing file ${fileName}:`,
                            error,
                        );
                        return [];
                    }
                }),
            )
        ).flat();

        const raceEntityList = raceRecordList.map((raceRecord) => {
            return new JraRaceEntity(
                raceRecord.id,
                new JraRaceData(
                    raceRecord.name,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.surfaceType,
                    raceRecord.distance,
                    raceRecord.grade,
                    raceRecord.number,
                    raceRecord.heldTimes,
                    raceRecord.heldDayTimes,
                ),
            );
        });
        return raceEntityList;
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceEntityList(
        request: RegisterRaceListRequest<JraRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: JraRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceEntityをRaceRecordに変換する
        const raceRecordList: JraRaceRecord[] = request.raceEntityList.map(
            (raceEntity) => raceEntity.toRecord(),
        );

        // idが重複しているデータは上書きをし、新規のデータは追加する
        raceRecordList.forEach((raceRecord) => {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRaceRecordList.findIndex(
                (record) => record.id === raceRecord.id,
            );
            if (index !== -1) {
                existFetchRaceRecordList[index] = raceRecord;
            } else {
                existFetchRaceRecordList.push(raceRecord);
            }
        });

        // 日付の最新順にソート
        existFetchRaceRecordList.sort(
            (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
        );

        // 月毎に分けられたplaceをS3にアップロードする
        await this.s3Gateway.uploadDataToS3(
            existFetchRaceRecordList,
            this.fileName,
        );
        return new RegisterRaceListResponse(200);
    }
}
