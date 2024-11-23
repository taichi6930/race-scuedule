import { inject, injectable } from 'tsyringe';

import { WorldRaceData } from '../../domain/worldRaceData';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { WorldGradeType, WorldRaceCourse } from '../../utility/data/world';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 競輪場開催データUseCase
 */
@injectable()
export class WorldRaceDataUseCase
    implements IRaceDataUseCase<WorldRaceData, WorldGradeType, WorldRaceCourse>
{
    constructor(
        @inject('WorldRaceRepositoryFromStorage')
        private readonly worldRaceRepositoryFromStorage: IRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
        @inject('WorldRaceRepositoryFromHtml')
        private readonly worldRaceRepositoryFromHtml: IRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
    ) {}
    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     */
    async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<WorldRaceData[]> {
        // レースデータを取得する
        return (
            await this.getRaceDataList(startDate, finishDate, 'storage')
        ).map((raceEntity) => {
            return new WorldRaceData(
                raceEntity.name,
                raceEntity.dateTime,
                raceEntity.location,
                raceEntity.surfaceType,
                raceEntity.distance,
                raceEntity.grade,
                raceEntity.number,
            );
        });
    }

    /**
     * レース開催データを更新する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    async updateRaceDataList(startDate: Date, finishDate: Date): Promise<void> {
        try {
            // レースデータを取得する
            const raceList = await this.getRaceDataList(
                startDate,
                finishDate,
                'web',
            );

            console.log('レースデータを登録する');
            // S3にデータを保存する
            await this.registerRaceDataList(raceList);
        } catch (error) {
            console.error('レースデータの更新中にエラーが発生しました:', error);
        }
    }

    /**
     * レース開催データを更新する
     * @param raceList
     */
    @Logger
    async upsertRaceDataList(raceList: WorldRaceData[]): Promise<void> {
        try {
            // jraRaceDataをJraRaceEntityに変換する
            const raceEntityList = raceList.map((raceData) => {
                return new WorldRaceEntity(
                    null,
                    raceData.name,
                    raceData.dateTime,
                    raceData.location,
                    raceData.surfaceType,
                    raceData.distance,
                    raceData.grade,
                    raceData.number,
                );
            });
            // S3にデータを保存する
            await this.registerRaceDataList(raceEntityList);
        } catch (error) {
            console.error('レースデータの更新中にエラーが発生しました:', error);
        }
    }

    /**
     * レースデータを取得する
     * S3から取得する場合はstorage、Webから取得する場合はwebを指定する
     *
     * @param startDate
     * @param finishDate
     * @param placeList
     * @param type
     */
    @Logger
    private async getRaceDataList(
        startDate: Date,
        finishDate: Date,
        type: 'storage' | 'web',
    ): Promise<WorldRaceEntity[]> {
        const fetchRaceListRequest = new FetchRaceListRequest<WorldPlaceEntity>(
            startDate,
            finishDate,
        );
        const fetchRaceListResponse: FetchRaceListResponse<WorldRaceEntity> =
            type === 'storage'
                ? await this.worldRaceRepositoryFromStorage.fetchRaceList(
                      fetchRaceListRequest,
                  )
                : await this.worldRaceRepositoryFromHtml.fetchRaceList(
                      fetchRaceListRequest,
                  );
        return fetchRaceListResponse.raceDataList;
    }

    /**
     * レースデータを登録する
     *
     * @param raceList
     */
    @Logger
    private async registerRaceDataList(
        raceList: WorldRaceEntity[],
    ): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<WorldRaceEntity>(raceList);
        await this.worldRaceRepositoryFromStorage.registerRaceList(
            registerRaceListRequest,
        );
    }
}
