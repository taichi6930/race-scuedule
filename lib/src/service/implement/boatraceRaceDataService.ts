import { inject, injectable } from 'tsyringe';

import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { Logger } from '../../utility/logger';
import { IRaceDataService } from '../interface/IRaceDataService';

@injectable()
export class BoatraceRaceDataService
    implements IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
{
    constructor(
        @inject('BoatraceRaceRepositoryFromStorage')
        private readonly boatraceRaceRepositoryFromStorage: IRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromHtml')
        private readonly boatraceRaceRepositoryFromHtml: IRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
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
        placeEntityList?: BoatracePlaceEntity[],
    ): Promise<BoatraceRaceEntity[]> {
        try {
            const fetchRaceListRequest =
                new FetchRaceListRequest<BoatracePlaceEntity>(
                    startDate,
                    finishDate,
                    placeEntityList,
                );
            const repository =
                type === 'storage'
                    ? this.boatraceRaceRepositoryFromStorage
                    : this.boatraceRaceRepositoryFromHtml;

            const fetchRaceListResponse: FetchRaceListResponse<BoatraceRaceEntity> =
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
        raceEntityList: BoatraceRaceEntity[],
    ): Promise<void> {
        try {
            // EntityListが空の場合は更新処理を行わない
            if (raceEntityList.length === 0) {
                return;
            }
            const registerRaceListRequest =
                new RegisterRaceListRequest<BoatraceRaceEntity>(raceEntityList);
            await this.boatraceRaceRepositoryFromStorage.registerRaceEntityList(
                registerRaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
