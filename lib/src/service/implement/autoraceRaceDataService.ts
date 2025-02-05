import { inject, injectable } from 'tsyringe';

import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IRaceDataService } from '../interface/IRaceDataService';

@injectable()
export class AutoraceRaceDataService
    implements IRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
{
    constructor(
        @inject('AutoraceRaceRepositoryFromStorage')
        private readonly autoraceRaceRepositoryFromStorage: IRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromHtml')
        private readonly autoraceRaceRepositoryFromHtml: IRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
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
        type: DataLocationType,
        placeEntityList?: AutoracePlaceEntity[],
    ): Promise<AutoraceRaceEntity[]> {
        try {
            const fetchRaceListRequest =
                new FetchRaceListRequest<AutoracePlaceEntity>(
                    startDate,
                    finishDate,
                    placeEntityList,
                );
            const repository =
                type === DataLocation.Storage
                    ? this.autoraceRaceRepositoryFromStorage
                    : this.autoraceRaceRepositoryFromHtml;

            const fetchRaceListResponse: FetchRaceListResponse<AutoraceRaceEntity> =
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
        raceEntityList: AutoraceRaceEntity[],
    ): Promise<void> {
        try {
            // EntityListが空の場合は更新処理を行わない
            if (raceEntityList.length === 0) return;
            const registerRaceListRequest =
                new RegisterRaceListRequest<AutoraceRaceEntity>(raceEntityList);
            await this.autoraceRaceRepositoryFromStorage.registerRaceEntityList(
                registerRaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
