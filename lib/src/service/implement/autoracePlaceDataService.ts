import { inject, injectable } from 'tsyringe';

import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../repository/request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { Logger } from '../../utility/logger';
import { IPlaceDataService } from '../interface/IPlaceDataService';

@injectable()
export class AutoracePlaceDataService
    implements IPlaceDataService<AutoracePlaceEntity>
{
    constructor(
        @inject('AutoracePlaceRepositoryFromStorage')
        private readonly autoracePlaceRepositoryFromStorage: IPlaceRepository<AutoracePlaceEntity>,
        @inject('AutoracePlaceRepositoryFromHtml')
        private readonly autoracePlaceRepositoryFromHtml: IPlaceRepository<AutoracePlaceEntity>,
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
    ): Promise<AutoracePlaceEntity[]> {
        try {
            const request: FetchPlaceListRequest = new FetchPlaceListRequest(
                startDate,
                finishDate,
            );

            const repository =
                type === 'storage'
                    ? this.autoracePlaceRepositoryFromStorage
                    : this.autoracePlaceRepositoryFromHtml;

            const response: FetchPlaceListResponse<AutoracePlaceEntity> =
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
        placeEntityList: AutoracePlaceEntity[],
    ): Promise<void> {
        try {
            // Entityのリストが空の場合は処理を行わない
            if (placeEntityList.length === 0) {
                return;
            }
            const registerPlaceListRequest =
                new RegisterPlaceListRequest<AutoracePlaceEntity>(
                    placeEntityList,
                );
            await this.autoracePlaceRepositoryFromStorage.registerPlaceEntityList(
                registerPlaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
