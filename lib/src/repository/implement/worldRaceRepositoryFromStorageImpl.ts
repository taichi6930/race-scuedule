import 'reflect-metadata';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { WorldRaceData } from '../../domain/worldRaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { WorldRaceRecord } from '../../gateway/record/worldRaceRecord';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import {
    WorldGradeType,
    WorldRaceCourse,
    WorldRaceCourseType,
} from '../../utility/data/world';
import { Logger } from '../../utility/logger';
import { WorldRaceId } from '../../utility/raceId';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class WorldRaceRepositoryFromStorageImpl
    implements IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
{
    constructor(
        @inject('WorldRaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<WorldRaceRecord>,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<WorldPlaceEntity>,
    ): Promise<FetchRaceListResponse<WorldRaceEntity>> {
        // ファイル名リストから競馬場開催データを取得する
        const raceRecordList: WorldRaceRecord[] =
            await this.fetchRaceRecordList(
                request.startDate,
                request.finishDate,
            );

        // レースデータをEntityに変換
        const raceEntityList: WorldRaceEntity[] =
            this.translateRaceRecordListToRaceEntityList(raceRecordList);

        return new FetchRaceListResponse(raceEntityList);
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceEntityList(
        request: RegisterRaceListRequest<WorldRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        const raceEntityList: WorldRaceEntity[] = request.raceEntityList;
        // レースデータをRecordの形式に変換
        const raceRecordList: WorldRaceRecord[] =
            this.translateRaceEntityListToRaceRecordList(raceEntityList);
        // レースデータを日付ごとに分割する
        const raceRecordDict: Record<string, WorldRaceRecord[]> = {};
        raceRecordList.forEach((raceRecord) => {
            const key = `${format(raceRecord.dateTime, 'yyyyMMdd')}.csv`;
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

    /**
     * startDateからfinishDateまでの日付ごとのファイル名リストを生成する
     * @param startDate
     * @param finishDate
     * @returns
     */
    private generateFilenameList(startDate: Date, finishDate: Date): string[] {
        const fileNames: string[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= finishDate) {
            const fileName = `${format(currentDate, 'yyyyMMdd')}.csv`;
            fileNames.push(fileName);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return fileNames;
    }

    /**
     * レースデータをRecordの形式で取得する
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    private async fetchRaceRecordList(
        startDate: Date,
        finishDate: Date,
    ): Promise<WorldRaceRecord[]> {
        // startDateからfinishDateまでの日ごとのファイル名リストを生成する
        const fileNames: string[] = this.generateFilenameList(
            startDate,
            finishDate,
        );

        return (
            await Promise.all(
                fileNames.map(async (fileName) => {
                    const csv = await this.s3Gateway.fetchDataFromS3(fileName);
                    const [headerLine, ...lines] = csv.split('\n');
                    const headers = headerLine.split(',');

                    const indices = {
                        id: headers.indexOf('id'),
                        name: headers.indexOf('name'),
                        dateTime: headers.indexOf('dateTime'),
                        location: headers.indexOf('location'),
                        surfaceType: headers.indexOf('surfaceType'),
                        distance: headers.indexOf('distance'),
                        grade: headers.indexOf('grade'),
                        number: headers.indexOf('number'),
                    };

                    return lines
                        .map((line) => {
                            const columns = line.split(',');
                            const raceId = columns[indices.id] as WorldRaceId;
                            const raceName = columns[indices.name];
                            const raceDate = new Date(
                                columns[indices.dateTime],
                            );
                            const raceLocation = columns[
                                indices.location
                            ] as WorldRaceCourse;
                            const raceSurfaceType = columns[
                                indices.surfaceType
                            ] as WorldRaceCourseType;
                            const raceDistance = parseInt(
                                columns[indices.distance],
                            );
                            const raceGrade = columns[
                                indices.grade
                            ] as WorldGradeType;
                            const raceNumber = parseInt(
                                columns[indices.number],
                            );

                            if (
                                !raceId ||
                                !raceName ||
                                isNaN(raceDate.getTime()) ||
                                !raceLocation ||
                                !raceSurfaceType ||
                                isNaN(raceDistance) ||
                                !raceGrade ||
                                isNaN(raceNumber)
                            ) {
                                return undefined;
                            }

                            return new WorldRaceRecord(
                                raceId,
                                raceName,
                                raceDate,
                                raceLocation,
                                raceSurfaceType,
                                raceDistance,
                                raceGrade,
                                raceNumber,
                            );
                        })
                        .filter(
                            (raceData): raceData is WorldRaceRecord =>
                                raceData !== undefined,
                        );
                }),
            )
        ).flat();
    }

    /**
     * raceRecordListをraceEntityListに変換する
     * @param raceRecordList
     * @returns
     */
    @Logger
    private translateRaceRecordListToRaceEntityList(
        raceRecordList: WorldRaceRecord[],
    ): WorldRaceEntity[] {
        return raceRecordList.map(
            (record) =>
                new WorldRaceEntity(
                    record.id,
                    new WorldRaceData(
                        record.name,
                        record.dateTime,
                        record.location,
                        record.surfaceType,
                        record.distance,
                        record.grade,
                        record.number,
                    ),
                ),
        );
    }

    /**
     * raceEntityListをraceRecordListに変換する
     * @param request
     */
    @Logger
    private translateRaceEntityListToRaceRecordList(
        raceEntityList: WorldRaceEntity[],
    ): WorldRaceRecord[] {
        return raceEntityList.map((entity) => {
            const raceData = entity.raceData;
            return new WorldRaceRecord(
                entity.id,
                raceData.name,
                raceData.dateTime,
                raceData.location,
                raceData.surfaceType,
                raceData.distance,
                raceData.grade,
                raceData.number,
            );
        });
    }
}
