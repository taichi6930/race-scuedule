import { inject, injectable } from 'tsyringe';

import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../repository/request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { Logger } from '../../utility/logger';
import { IPlaceDataService } from '../interface/IPlaceDataService';

@injectable()
export class NarPlaceDataService implements IPlaceDataService<NarPlaceEntity> {
    constructor(
        @inject('NarPlaceRepositoryFromStorage')
        private readonly narPlaceRepositoryFromStorage: IPlaceRepository<NarPlaceEntity>,
        @inject('NarPlaceRepositoryFromHtml')
        private readonly narPlaceRepositoryFromHtml: IPlaceRepository<NarPlaceEntity>,
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
    ): Promise<NarPlaceEntity[]> {
        try {
            const request: FetchPlaceListRequest = new FetchPlaceListRequest(
                startDate,
                finishDate,
            );

            const repository =
                type === 'storage'
                    ? this.narPlaceRepositoryFromStorage
                    : this.narPlaceRepositoryFromHtml;

            const response: FetchPlaceListResponse<NarPlaceEntity> =
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
        placeEntityList: NarPlaceEntity[],
    ): Promise<void> {
        try {
            // Entityのリストが空の場合は処理を行わない
            if (placeEntityList.length === 0) {
                return;
            }
            const registerPlaceListRequest =
                new RegisterPlaceListRequest<NarPlaceEntity>(placeEntityList);
            await this.narPlaceRepositoryFromStorage.registerPlaceEntityList(
                registerPlaceListRequest,
            );
        } catch (error) {
            console.error('レースデータの更新に失敗しました', error);
        }
    }
}
