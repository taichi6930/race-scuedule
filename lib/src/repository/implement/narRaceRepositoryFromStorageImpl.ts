import '../../utility/format';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { NarRaceRecord } from '../../gateway/record/narRaceRecord';
import {
    NarGradeType,
    NarRaceCourse,
    NarRaceCourseType,
} from '../../utility/data/nar';
import { Logger } from '../../utility/logger';
import { NarRaceId } from '../../utility/raceId';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

@injectable()
export class NarRaceRepositoryFromStorageImpl
    implements IRaceRepository<NarRaceEntity, NarPlaceEntity>
{
    constructor(
        @inject('NarRaceS3Gateway')
        private s3Gateway: IS3Gateway<NarRaceRecord>,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<NarPlaceEntity>,
    ): Promise<FetchRaceListResponse<NarRaceEntity>> {
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

                        // データ行を解析してNarRaceEntityのリストを生成
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

                                    return new NarRaceRecord(
                                        columns[idIndex] as NarRaceId,
                                        columns[raceNameIndex],
                                        new Date(columns[raceDateIndex]),
                                        columns[placeIndex] as NarRaceCourse,
                                        columns[
                                            surfaceTypeIndex
                                        ] as NarRaceCourseType,
                                        parseInt(columns[distanceIndex]),
                                        columns[gradeIndex] as NarGradeType,
                                        parseInt(columns[raceNumIndex]),
                                    );
                                })
                                .filter(
                                    (raceData): raceData is NarRaceRecord =>
                                        raceData !== undefined,
                                )
                                // IDが重複している場合は1つにまとめる
                                .reduce<NarRaceRecord[]>((acc, raceData) => {
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
            return new NarRaceEntity(
                raceRecord.id,
                new NarRaceData(
                    raceRecord.name,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.surfaceType,
                    raceRecord.distance,
                    raceRecord.grade,
                    raceRecord.number,
                ),
            );
        });

        return new FetchRaceListResponse<NarRaceEntity>(raceEntityList);
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceList(
        request: RegisterRaceListRequest<NarRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        const raceEntity: NarRaceEntity[] = request.raceEntityList;
        // レースデータを日付ごとに分割する
        const raceRecordDict: Record<string, NarRaceRecord[]> = {};
        raceEntity.forEach((race) => {
            const raceRecord = new NarRaceRecord(
                race.id,
                race.raceData.name,
                race.raceData.dateTime,
                race.raceData.location,
                race.raceData.surfaceType,
                race.raceData.distance,
                race.raceData.grade,
                race.raceData.number,
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
