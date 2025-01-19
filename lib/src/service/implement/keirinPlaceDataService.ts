import { inject, injectable } from 'tsyringe';

import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../repository/request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { Logger } from '../../utility/logger';
import { IPlaceDataService } from '../interface/IPlaceDataService';

@injectable()
export class KeirinPlaceDataService
    implements IPlaceDataService<KeirinPlaceEntity>
{
    constructor(
        @inject('KeirinPlaceRepositoryFromStorage')
        private readonly keirinPlaceRepositoryFromStorage: IPlaceRepository<KeirinPlaceEntity>,
        @inject('KeirinPlaceRepositoryFromHtml')
        private readonly keirinPlaceRepositoryFromHtml: IPlaceRepository<KeirinPlaceEntity>,
    ) {}
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
    ): Promise<KeirinPlaceEntity[]> {
        try {
            const request: FetchPlaceListRequest = new FetchPlaceListRequest(
                startDate,
                finishDate,
            );

            const repository =
                type === 'storage'
                    ? this.keirinPlaceRepositoryFromStorage
                    : this.keirinPlaceRepositoryFromHtml;

            const response: FetchPlaceListResponse<KeirinPlaceEntity> =
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
        placeEntityList: KeirinPlaceEntity[],
    ): Promise<void> {
        try {
            // Entityのリストが空の場合は処理を行わない
            if (placeEntityList.length === 0) {
                return;
            }
            const registerPlaceListRequest =
                new RegisterPlaceListRequest<KeirinPlaceEntity>(
                    placeEntityList,
                );
            await this.keirinPlaceRepositoryFromStorage.registerPlaceEntityList(
                registerPlaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
