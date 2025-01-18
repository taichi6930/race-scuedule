import { inject, injectable } from 'tsyringe';

import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { Logger } from '../../utility/logger';
import { IRaceDataService } from '../interface/IRaceDataService';

@injectable()
export class WorldRaceDataService
    implements IRaceDataService<WorldRaceEntity, WorldPlaceEntity>
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
     *
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        type: 'storage' | 'web',
        placeEntityList?: WorldPlaceEntity[],
    ): Promise<WorldRaceEntity[]> {
        try {
            const fetchRaceListRequest =
                new FetchRaceListRequest<WorldPlaceEntity>(
                    startDate,
                    finishDate,
                    placeEntityList,
                );
            const repository =
                type === 'storage'
                    ? this.worldRaceRepositoryFromStorage
                    : this.worldRaceRepositoryFromHtml;

            const fetchRaceListResponse: FetchRaceListResponse<WorldRaceEntity> =
                await repository.fetchRaceEntityList(fetchRaceListRequest);
            return fetchRaceListResponse.raceEntityList;
        } catch (error) {
            console.error('レースデータの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * レース開催データを更新する
     * @param raceEntityList
     */
    @Logger
    async updateRaceEntityList(
        raceEntityList: WorldRaceEntity[],
    ): Promise<void> {
        try {
            // EntityListが空の場合は更新処理を行わない
            if (raceEntityList.length === 0) {
                return;
            }
            const registerRaceListRequest =
                new RegisterRaceListRequest<WorldRaceEntity>(raceEntityList);
            await this.worldRaceRepositoryFromStorage.registerRaceEntityList(
                registerRaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
