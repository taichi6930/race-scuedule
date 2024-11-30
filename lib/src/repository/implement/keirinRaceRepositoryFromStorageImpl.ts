import 'reflect-metadata';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KeirinRacePlayerData } from '../../domain/keirinRacePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { KeirinRacePlayerRecord } from '../../gateway/record/keirinRacePlayerRecord';
import { KeirinRaceRecord } from '../../gateway/record/keirinRaceRecord';
import {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from '../../utility/data/keirin';
import { Logger } from '../../utility/logger';
import {
    generateKeirinRacePlayerId,
    KeirinRaceId,
    KeirinRacePlayerId,
} from '../../utility/raceId';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class KeirinRaceRepositoryFromStorageImpl
    implements IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
{
    constructor(
        @inject('KeirinRaceS3Gateway')
        private readonly raceS3Gateway: IS3Gateway<KeirinRaceRecord>,
        @inject('KeirinRacePlayerS3Gateway')
        private readonly racePlayerS3Gateway: IS3Gateway<KeirinRacePlayerRecord>,
    ) {}
    /**
     * 競輪場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<KeirinPlaceEntity>,
    ): Promise<FetchRaceListResponse<KeirinRaceEntity>> {
        // startDateからfinishDateまでの日ごとのファイル名リストを生成する
        const fileNames: string[] = this.generateFilenameList(
            request.startDate,
            request.finishDate,
        );

        // ファイル名リストから競輪レース選手データを取得する
        const racePlayerRecordList: KeirinRacePlayerRecord[] = (
            await Promise.all(
                fileNames.map(async (fileName) => {
                    // S3からデータを取得する
                    const csv =
                        await this.racePlayerS3Gateway.fetchDataFromS3(
                            fileName,
                        );

                    // CSVを行ごとに分割
                    const lines = csv.split('\n');

                    // ヘッダー行を解析
                    const headers = lines[0].split(',');

                    //      * @param id - ID
                    //  * @param raceId - レースID
                    //                     * @param positionNumber - 枠番
                    //                         * @param playerNumber - 選手番号
                    // ヘッダーに基づいてインデックスを取得
                    const idIndex = headers.indexOf('id');
                    const raceIdIndex = headers.indexOf('raceId');
                    const positionNumberIndex =
                        headers.indexOf('positionNumber');
                    const playerNumberIndex = headers.indexOf('playerNumber');

                    // データ行を解析してKeirinRaceDataのリストを生成
                    return lines
                        .slice(1)
                        .map((line: string) => {
                            const columns = line.split(',');

                            // 必要なフィールドが存在しない場合はundefinedを返す
                            if (
                                !columns[raceIdIndex] ||
                                isNaN(parseInt(columns[positionNumberIndex])) ||
                                isNaN(parseInt(columns[playerNumberIndex]))
                            ) {
                                return undefined;
                            }

                            return new KeirinRacePlayerRecord(
                                columns[idIndex] as KeirinRacePlayerId,
                                columns[raceIdIndex] as KeirinRaceId,
                                parseInt(columns[positionNumberIndex]),
                                parseInt(columns[playerNumberIndex]),
                            );
                        })
                        .filter(
                            (
                                racePlayerRecord,
                            ): racePlayerRecord is KeirinRacePlayerRecord =>
                                racePlayerRecord !== undefined,
                        );
                }),
            )
        ).flat();

        // ファイル名リストから競輪レースデータを取得する
        const raceDataList = (
            await Promise.all(
                fileNames.map(async (fileName) => {
                    // S3からデータを取得する
                    const csv =
                        await this.raceS3Gateway.fetchDataFromS3(fileName);

                    // CSVを行ごとに分割
                    const lines = csv.split('\n');

                    // ヘッダー行を解析
                    const headers = lines[0].split(',');

                    // ヘッダーに基づいてインデックスを取得
                    const idIndex = headers.indexOf('id');
                    const raceNameIndex = headers.indexOf('name');
                    const raceStageIndex = headers.indexOf('stage');
                    const raceDateIndex = headers.indexOf('dateTime');
                    const placeIndex = headers.indexOf('location');
                    const gradeIndex = headers.indexOf('grade');
                    const raceNumIndex = headers.indexOf('number');

                    // データ行を解析してKeirinRaceDataのリストを生成
                    return lines
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

                            return new KeirinRaceEntity(
                                columns[idIndex] as KeirinRaceId,
                                new KeirinRaceData(
                                    columns[raceNameIndex],
                                    columns[raceStageIndex] as KeirinRaceStage,
                                    new Date(columns[raceDateIndex]),
                                    columns[placeIndex] as KeirinRaceCourse,
                                    columns[gradeIndex] as KeirinGradeType,
                                    parseInt(columns[raceNumIndex]),
                                ),
                                // racePlayerRecordList のraceIdが columns[idIndex] と一致するものを取得
                                racePlayerRecordList
                                    .filter((racePlayerRecord) => {
                                        return (
                                            racePlayerRecord.raceId ===
                                            columns[idIndex]
                                        );
                                    })
                                    .map((racePlayerRecord) => {
                                        return new KeirinRacePlayerData(
                                            racePlayerRecord.positionNumber,
                                            racePlayerRecord.playerNumber,
                                        );
                                    }),
                            );
                        })
                        .filter(
                            (raceData): raceData is KeirinRaceEntity =>
                                raceData !== undefined,
                        );
                }),
            )
        ).flat();

        return new FetchRaceListResponse(raceDataList);
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
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceList(
        request: RegisterRaceListRequest<KeirinRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        const raceEntityList: KeirinRaceEntity[] = request.raceDataList;
        // レースデータを日付ごとに分割する
        const raceRecordDict: Record<string, KeirinRaceRecord[]> = {};
        raceEntityList.forEach((raceEntity) => {
            const raceRecord = new KeirinRaceRecord(
                raceEntity.id,
                raceEntity.raceData.name,
                raceEntity.raceData.stage,
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.grade,
                raceEntity.raceData.number,
            );
            const key = `${format(raceRecord.dateTime, 'yyyyMMdd')}.csv`;
            if (!(key in raceRecordDict)) {
                raceRecordDict[key] = [];
            }
            raceRecordDict[key].push(raceRecord);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, raceRecord] of Object.entries(raceRecordDict)) {
            await this.raceS3Gateway.uploadDataToS3(raceRecord, fileName);
        }

        const racePlayerRecordDict: Record<string, KeirinRacePlayerRecord[]> =
            {};
        raceEntityList.forEach((raceEntity) => {
            const racePlayerRecordList = raceEntity.racePlayerDataList.map(
                (racePlayerData) => {
                    return new KeirinRacePlayerRecord(
                        generateKeirinRacePlayerId(
                            raceEntity.raceData.dateTime,
                            raceEntity.raceData.location,
                            raceEntity.raceData.number,
                            racePlayerData.positionNumber,
                        ),
                        raceEntity.id,
                        racePlayerData.positionNumber,
                        racePlayerData.playerNumber,
                    );
                },
            );
            const key = `${format(raceEntity.raceData.dateTime, 'yyyyMMdd')}.csv`;
            if (!(key in racePlayerRecordDict)) {
                racePlayerRecordDict[key] = [];
            }
            racePlayerRecordList.forEach((racePlayerRecord) => {
                racePlayerRecordDict[key].push(racePlayerRecord);
            });
        });
        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, racePlayerRecord] of Object.entries(
            racePlayerRecordDict,
        )) {
            await this.racePlayerS3Gateway.uploadDataToS3(
                racePlayerRecord,
                fileName,
            );
        }
        return new RegisterRaceListResponse(200);
    }
}
