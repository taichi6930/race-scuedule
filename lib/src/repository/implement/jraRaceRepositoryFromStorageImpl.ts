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
import { JraRaceId } from '../../utility/raceId';
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
        // startDateからfinishDateまでの日ごとのファイル名リストを生成する
        const fileNames: string[] = [];
        const currentDate = new Date(request.startDate);
        while (currentDate <= request.finishDate) {
            const fileName = `${format(currentDate, 'yyyyMMdd')}.csv`;
            fileNames.push(fileName);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // ファイル名リストから競馬場開催データを取得する
        const raceRecordList = (
            await Promise.all(
                fileNames.map(async (fileName) => {
                    try {
                        const csv =
                            await this.s3Gateway.fetchDataFromS3(fileName);

                        // CSVを行ごとに分割
                        const lines = csv.split('\n');

                        // ヘッダー行を解析
                        const headers = lines[0].split(',');

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
                                    const columns = line.split(',');

                                    // 必要なフィールドが存在しない場合はundefinedを返す
                                    if (
                                        !columns[raceNameIndex] ||
                                        isNaN(parseInt(columns[raceNumIndex]))
                                    ) {
                                        return undefined;
                                    }

                                    return new JraRaceRecord(
                                        columns[idIndex] as JraRaceId,
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

        return new FetchRaceListResponse<JraRaceEntity>(raceEntityList);
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceEntityList(
        request: RegisterRaceListRequest<JraRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        const raceEntity: JraRaceEntity[] = request.raceEntityList;
        // レースデータを日付ごとに分割する
        const raceRecordDict: Record<string, JraRaceRecord[]> = {};
        raceEntity.forEach((race) => {
            const raceRecord = new JraRaceRecord(
                race.id,
                race.raceData.name,
                race.raceData.dateTime,
                race.raceData.location,
                race.raceData.surfaceType,
                race.raceData.distance,
                race.raceData.grade,
                race.raceData.number,
                race.raceData.heldTimes,
                race.raceData.heldDayTimes,
            );
            const key = `${format(race.raceData.dateTime, 'yyyyMMdd')}.csv`;
            // 日付ごとに分割されたレースデータを格納
            if (!(key in raceRecordDict)) {
                raceRecordDict[key] = [];
            }

            // 既に存在する場合は追加しない
            if (
                raceRecordDict[key].findIndex(
                    (record) => record.id === raceRecord.id,
                ) !== -1
            ) {
                return;
            }

            raceRecordDict[key].push(raceRecord);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, raceData] of Object.entries(raceRecordDict)) {
            await this.s3Gateway.uploadDataToS3(raceData, fileName);
        }
        return new RegisterRaceListResponse(200);
    }
}
