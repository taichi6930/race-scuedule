import { inject, injectable } from 'tsyringe';

import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../repository/request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

@injectable()
export class BoatracePlaceDataUseCase
    implements IPlaceDataUseCase<BoatracePlaceData>
{
    constructor(
        @inject('BoatracePlaceRepositoryFromStorage')
        private readonly boatracePlaceRepositoryFromStorage: IPlaceRepository<BoatracePlaceEntity>,
        @inject('BoatracePlaceRepositoryFromHtml')
        private readonly boatracePlaceRepositoryFromHtml: IPlaceRepository<BoatracePlaceEntity>,
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
    ): Promise<BoatracePlaceData[]> {
        const request: FetchPlaceListRequest = new FetchPlaceListRequest(
            startDate,
            finishDate,
        );
        const response: FetchPlaceListResponse<BoatracePlaceEntity> =
            await this.boatracePlaceRepositoryFromStorage.fetchPlaceList(
                request,
            );
        // placeEntityListをplaceDataListに変換する
        const placeDataList: BoatracePlaceData[] = response.placeDataList.map(
            (placeEntity) => {
                return placeEntity.placeData;
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
        const fetchPlaceListResponse: FetchPlaceListResponse<BoatracePlaceEntity> =
            await this.boatracePlaceRepositoryFromHtml.fetchPlaceList(
                fetchPlaceListRequest,
            );
        // S3にデータを保存する
        const registerPlaceListRequest =
            new RegisterPlaceListRequest<BoatracePlaceEntity>(
                fetchPlaceListResponse.placeDataList,
            );
        await this.boatracePlaceRepositoryFromStorage.registerPlaceList(
            registerPlaceListRequest,
        );
    }
}
