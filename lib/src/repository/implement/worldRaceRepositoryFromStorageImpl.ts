import 'reflect-metadata';

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
    private readonly fileName = 'raceList.csv';

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
        // ファイル名リストから海外競馬場開催データを取得する
        const raceRecordList: WorldRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceRecordをRaceEntityに変換
        const raceEntityList: WorldRaceEntity[] = raceRecordList.map(
            (raceRecord) => {
                return new WorldRaceEntity(
                    raceRecord.id,
                    new WorldRaceData(
                        raceRecord.name,
                        raceRecord.dateTime,
                        raceRecord.location,
                        raceRecord.surfaceType,
                        raceRecord.distance,
                        raceRecord.grade,
                        raceRecord.number,
                    ),
                );
            },
        );

        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: WorldRaceEntity[] = raceEntityList.filter(
            (raceEntity) =>
                raceEntity.raceData.dateTime >= request.startDate &&
                raceEntity.raceData.dateTime <= request.finishDate,
        );

        return new FetchRaceListResponse(filteredRaceEntityList);
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceEntityList(
        request: RegisterRaceListRequest<WorldRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: WorldRaceRecord[] =
            await this.getRaceRecordListFromS3();

        const raceRecordList: WorldRaceRecord[] = request.raceEntityList.map(
            (raceEntity) => {
                return new WorldRaceRecord(
                    raceEntity.id,
                    raceEntity.raceData.name,
                    raceEntity.raceData.dateTime,
                    raceEntity.raceData.location,
                    raceEntity.raceData.surfaceType,
                    raceEntity.raceData.distance,
                    raceEntity.raceData.grade,
                    raceEntity.raceData.number,
                );
            },
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

        // 月毎に分けられたplaceをS3にアップロードする
        await this.s3Gateway.uploadDataToS3(
            existFetchRaceRecordList,
            this.fileName,
        );
        return new RegisterRaceListResponse(200);
    }

    /**
     * レースデータをS3から取得する
     * @param request
     */
    @Logger
    private async getRaceRecordListFromS3(): Promise<WorldRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(this.fileName);

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

        // データ行を解析してRaceDataのリストを生成
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

                return new WorldRaceRecord(
                    columns[idIndex] as WorldRaceId,
                    columns[raceNameIndex],
                    new Date(columns[raceDateIndex]),
                    columns[placeIndex] as WorldRaceCourse,
                    columns[surfaceTypeIndex] as WorldRaceCourseType,
                    parseInt(columns[distanceIndex]),
                    columns[gradeIndex] as WorldGradeType,
                    parseInt(columns[raceNumIndex]),
                );
            })
            .filter(
                (raceData): raceData is WorldRaceRecord =>
                    raceData !== undefined,
            );
    }
}
