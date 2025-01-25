import { inject, injectable } from 'tsyringe';

import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { Logger } from '../../utility/logger';
import { IRaceDataService } from '../interface/IRaceDataService';

@injectable()
export class KeirinRaceDataService
    implements IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
{
    constructor(
        @inject('KeirinRaceRepositoryFromStorage')
        private readonly keirinRaceRepositoryFromStorage: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromHtml')
        private readonly keirinRaceRepositoryFromHtml: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
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
        placeEntityList?: KeirinPlaceEntity[],
    ): Promise<KeirinRaceEntity[]> {
        try {
            const fetchRaceListRequest =
                new FetchRaceListRequest<KeirinPlaceEntity>(
                    startDate,
                    finishDate,
                    placeEntityList,
                );
            const repository =
                type === 'storage'
                    ? this.keirinRaceRepositoryFromStorage
                    : this.keirinRaceRepositoryFromHtml;

            const fetchRaceListResponse: FetchRaceListResponse<KeirinRaceEntity> =
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
        raceEntityList: KeirinRaceEntity[],
    ): Promise<void> {
        try {
            // EntityListが空の場合は更新処理を行わない
            if (raceEntityList.length === 0) return;
            const registerRaceListRequest =
                new RegisterRaceListRequest<KeirinRaceEntity>(raceEntityList);
            await this.keirinRaceRepositoryFromStorage.registerRaceEntityList(
                registerRaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
