import { inject, injectable } from 'tsyringe';

import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { Logger } from '../../utility/logger';
import { IRaceDataService } from '../interface/IRaceDataService';

@injectable()
export class NarRaceDataService
    implements IRaceDataService<NarRaceEntity, NarPlaceEntity>
{
    constructor(
        @inject('NarRaceRepositoryFromStorage')
        private readonly narRaceRepositoryFromStorage: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >,
        @inject('NarRaceRepositoryFromHtml')
        private readonly narRaceRepositoryFromHtml: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
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
        placeEntityList?: NarPlaceEntity[],
    ): Promise<NarRaceEntity[]> {
        try {
            const fetchRaceListRequest =
                new FetchRaceListRequest<NarPlaceEntity>(
                    startDate,
                    finishDate,
                    placeEntityList,
                );
            const repository =
                type === 'storage'
                    ? this.narRaceRepositoryFromStorage
                    : this.narRaceRepositoryFromHtml;

            const fetchRaceListResponse: FetchRaceListResponse<NarRaceEntity> =
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
    async updateRaceEntityList(raceEntityList: NarRaceEntity[]): Promise<void> {
        try {
            // EntityListが空の場合は更新処理を行わない
            if (raceEntityList.length === 0) {
                return;
            }
            const registerRaceListRequest =
                new RegisterRaceListRequest<NarRaceEntity>(raceEntityList);
            await this.narRaceRepositoryFromStorage.registerRaceEntityList(
                registerRaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
