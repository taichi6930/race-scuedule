import { inject, injectable } from 'tsyringe';

import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IRaceDataService } from '../interface/IRaceDataService';

@injectable()
export class JraRaceDataService
    implements IRaceDataService<JraRaceEntity, JraPlaceEntity>
{
    constructor(
        @inject('JraRaceRepositoryFromStorage')
        private readonly jraRaceRepositoryFromStorage: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >,
        @inject('JraRaceRepositoryFromHtml')
        private readonly jraRaceRepositoryFromHtml: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
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
        placeEntityList?: JraPlaceEntity[],
    ): Promise<JraRaceEntity[]> {
        try {
            const fetchRaceListRequest =
                new FetchRaceListRequest<JraPlaceEntity>(
                    startDate,
                    finishDate,
                    placeEntityList,
                );
            const repository =
                type === DataLocation.Storage
                    ? this.jraRaceRepositoryFromStorage
                    : this.jraRaceRepositoryFromHtml;

            const fetchRaceListResponse: FetchRaceListResponse<JraRaceEntity> =
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
    async updateRaceEntityList(raceEntityList: JraRaceEntity[]): Promise<void> {
        try {
            // EntityListが空の場合は更新処理を行わない
            if (raceEntityList.length === 0) return;
            const registerRaceListRequest =
                new RegisterRaceListRequest<JraRaceEntity>(raceEntityList);
            await this.jraRaceRepositoryFromStorage.registerRaceEntityList(
                registerRaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
