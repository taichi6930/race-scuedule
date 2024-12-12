import { inject, injectable } from 'tsyringe';

import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../repository/request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

@injectable()
export class NarPlaceDataUseCase implements IPlaceDataUseCase<NarPlaceEntity> {
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
    ): Promise<NarPlaceEntity[]> {
        const request: FetchPlaceListRequest = new FetchPlaceListRequest(
            startDate,
            finishDate,
        );
        const response: FetchPlaceListResponse<NarPlaceEntity> =
            await this.narPlaceRepositoryFromStorage.fetchPlaceEntityList(
                request,
            );
        return response.placeEntityList;
    }

    /**
     * レース開催データを更新する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    async updatePlaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<void> {
        // startDateは月の1日に設定する
        const modifyStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            1,
        );
        // finishDateは月の最終日に設定する
        const modifyFinishDate = new Date(
            finishDate.getFullYear(),
            finishDate.getMonth() + 1,
            0,
        );
        // HTMLからデータを取得する
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(modifyStartDate, modifyFinishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<NarPlaceEntity> =
            await this.narPlaceRepositoryFromHtml.fetchPlaceEntityList(
                fetchPlaceListRequest,
            );
        // S3にデータを保存する
        const registerPlaceListRequest =
            new RegisterPlaceListRequest<NarPlaceEntity>(
                fetchPlaceListResponse.placeEntityList,
            );
        await this.narPlaceRepositoryFromStorage.registerPlaceEntityList(
            registerPlaceListRequest,
        );
    }
}
