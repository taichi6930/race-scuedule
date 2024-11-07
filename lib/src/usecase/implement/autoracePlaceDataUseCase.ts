import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

@injectable()
export class AutoracePlaceDataUseCase
    implements IPlaceDataUseCase<AutoracePlaceData>
{
    constructor(
        @inject('AutoracePlaceRepositoryFromStorage')
        private readonly autoracePlaceRepositoryFromStorage: IPlaceRepository<AutoracePlaceEntity>,
        // @inject('AutoracePlaceRepositoryFromHtml')
        // private readonly autoracePlaceRepositoryFromHtml: IPlaceRepository<AutoracePlaceEntity>,
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
    ): Promise<AutoracePlaceData[]> {
        const request: FetchPlaceListRequest = new FetchPlaceListRequest(
            startDate,
            finishDate,
        );
        const response: FetchPlaceListResponse<AutoracePlaceEntity> =
            await this.autoracePlaceRepositoryFromStorage.fetchPlaceList(
                request,
            );
        // placeEntityListをplaceDataListに変換する
        const placeDataList: AutoracePlaceData[] = response.placeDataList.map(
            (placeEntity) => {
                return new AutoracePlaceData(
                    placeEntity.dateTime,
                    placeEntity.location,
                    placeEntity.grade,
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
        //     // HTMLからデータを取得する
        //     const fetchPlaceListRequest: FetchPlaceListRequest =
        //         new FetchPlaceListRequest(modifyStartDate, modifyFinishDate);
        //     const fetchPlaceListResponse: FetchPlaceListResponse<AutoracePlaceEntity> =
        //         await this.autoracePlaceRepositoryFromHtml.fetchPlaceList(
        //             fetchPlaceListRequest,
        //         );
        //     // S3にデータを保存する
        //     const registerPlaceListRequest =
        //         new RegisterPlaceListRequest<AutoracePlaceEntity>(
        //             fetchPlaceListResponse.placeDataList,
        //         );
        //     await this.autoracePlaceRepositoryFromStorage.registerPlaceList(
        //         registerPlaceListRequest,
        //     );
        await Promise.resolve(
            `${modifyStartDate.getFullYear().toString()}, ${modifyFinishDate.getFullYear().toString()}`,
        );
    }
}
