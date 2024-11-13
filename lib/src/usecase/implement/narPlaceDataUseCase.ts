import { inject, injectable } from 'tsyringe';

import { NarPlaceData } from '../../domain/narPlaceData';
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
        @inject('NarPlaceRepositoryFromS3')
        private readonly narPlaceRepositoryFromS3: IPlaceRepository<NarPlaceEntity>,
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
    async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<NarPlaceData[]> {
        const request: FetchPlaceListRequest = new FetchPlaceListRequest(
            startDate,
            finishDate,
        );
        const response: FetchPlaceListResponse<NarPlaceEntity> =
            await this.narPlaceRepositoryFromS3.fetchPlaceList(request);
        const placeDataList: NarPlaceData[] = response.placeDataList.map(
            (placeEntity) => {
                return new NarPlaceData(
                    placeEntity.dateTime,
                    placeEntity.location,
                );
            },
        );
        return placeDataList;
    }

    /**
     * レース開催データを更新する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    async updatePlaceDataList(
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
            await this.narPlaceRepositoryFromHtml.fetchPlaceList(
                fetchPlaceListRequest,
            );
        // S3にデータを保存する
        const registerPlaceListRequest =
            new RegisterPlaceListRequest<NarPlaceEntity>(
                fetchPlaceListResponse.placeDataList,
            );
        await this.narPlaceRepositoryFromS3.registerPlaceList(
            registerPlaceListRequest,
        );
    }
}
