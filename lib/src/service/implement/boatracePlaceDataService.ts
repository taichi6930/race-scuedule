import { inject, injectable } from 'tsyringe';

import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../repository/request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { Logger } from '../../utility/logger';
import { IPlaceDataService } from '../interface/IPlaceDataService';

@injectable()
export class BoatracePlaceDataService
    implements IPlaceDataService<BoatracePlaceEntity>
{
    constructor(
        @inject('BoatracePlaceRepositoryFromStorage')
        private readonly boatracePlaceRepositoryFromStorage: IPlaceRepository<BoatracePlaceEntity>,
        @inject('BoatracePlaceRepositoryFromHtml')
        private readonly boatracePlaceRepositoryFromHtml: IPlaceRepository<BoatracePlaceEntity>,
    ) {}
    updatePlaceDataList: (startDate: Date, finishDate: Date) => Promise<void>;
    /**
     * レース開催データを取得する
     *
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    async fetchPlaceEntityList(
        startDate: Date,
        finishDate: Date,
        type: 'storage' | 'web',
    ): Promise<BoatracePlaceEntity[]> {
        try {
            const request: FetchPlaceListRequest = new FetchPlaceListRequest(
                startDate,
                finishDate,
            );

            const repository =
                type === 'storage'
                    ? this.boatracePlaceRepositoryFromStorage
                    : this.boatracePlaceRepositoryFromHtml;

            const response: FetchPlaceListResponse<BoatracePlaceEntity> =
                await repository.fetchPlaceEntityList(request);

            return response.placeEntityList;
        } catch (error) {
            console.error('レースデータの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * レース開催データを更新する
     *
     * @param placeEntityList
     */
    @Logger
    async updatePlaceEntityList(
        placeEntityList: BoatracePlaceEntity[],
    ): Promise<void> {
        try {
            // Entityのリストが空の場合は処理を行わない
            if (placeEntityList.length === 0) {
                return;
            }
            const registerPlaceListRequest =
                new RegisterPlaceListRequest<BoatracePlaceEntity>(
                    placeEntityList,
                );
            await this.boatracePlaceRepositoryFromStorage.registerPlaceEntityList(
                registerPlaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
