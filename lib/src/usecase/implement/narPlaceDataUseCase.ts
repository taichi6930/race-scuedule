import { injectable, inject } from 'tsyringe';
import { Logger } from '../../utility/logger';
import { NarPlaceData } from '../../domain/narPlaceData';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { RegisterPlaceListRequest } from '../../repository/request/registerPlaceListRequest';

@injectable()
export class NarPlaceDataUseCase implements IPlaceDataUseCase<NarPlaceData> {
    constructor(
        @inject('NarPlaceRepositoryFromS3')
        private readonly narPlaceRepositoryFromS3: IPlaceRepository<NarPlaceData>,
        @inject('NarPlaceRepositoryFromHtml')
        private readonly narPlaceRepositoryFromHtml: IPlaceRepository<NarPlaceData>,
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
        const response: FetchPlaceListResponse<NarPlaceData> =
            await this.narPlaceRepositoryFromS3.fetchPlaceList(request);
        return response.placeDataList;
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
        const fetchPlaceListResponse: FetchPlaceListResponse<NarPlaceData> =
            await this.narPlaceRepositoryFromHtml.fetchPlaceList(
                fetchPlaceListRequest,
            );
        // S3にデータを保存する
        const registerPlaceListRequest =
            new RegisterPlaceListRequest<NarPlaceData>(
                fetchPlaceListResponse.placeDataList,
            );
        await this.narPlaceRepositoryFromS3.registerPlaceList(
            registerPlaceListRequest,
        );
    }
}
