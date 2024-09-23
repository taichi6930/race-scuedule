import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { JraRaceData } from '../../domain/jraRaceData';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 競馬場開催データUseCase
 */
@injectable()
export class JraRaceDataUseCase implements IRaceDataUseCase<JraRaceData> {
    constructor(
        @inject('JraPlaceRepositoryFromS3')
        private readonly jraPlaceRepositoryFromS3: IPlaceRepository<JraPlaceData>,
        @inject('JraRaceRepositoryFromS3')
        private readonly jraRaceRepositoryFromS3: IRaceRepository<
            JraRaceData,
            JraPlaceData
        >,
        @inject('JraRaceRepositoryFromHtml')
        private readonly jraRaceRepositoryFromHtml: IRaceRepository<
            JraRaceData,
            JraPlaceData
        >,
    ) {}
    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     */
    async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<JraRaceData[]> {
        // 競馬場データを取得する
        const placeList = await this.getPlaceDataList(startDate, finishDate);

        // レースデータを取得する
        return this.getRaceDataList(
            startDate,
            finishDate,
            placeList,
            'storage',
        );
    }

    /**
     * レース開催データを更新する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    async updateRaceDataList(startDate: Date, finishDate: Date): Promise<void> {
        try {
            // 競馬場データを取得する
            const placeList = await this.getPlaceDataList(
                startDate,
                finishDate,
            );

            // レースデータを取得する
            const raceList = await this.getRaceDataList(
                startDate,
                finishDate,
                placeList,
                'web',
            );

            // S3にデータを保存する
            await this.registerRaceDataList(raceList);
        } catch (error) {
            console.error('レースデータの更新中にエラーが発生しました:', error);
        }
    }

    /**
     * 競馬場データの取得
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    private async getPlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<JraPlaceData[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<JraPlaceData> =
            await this.jraPlaceRepositoryFromS3.fetchPlaceList(
                fetchPlaceListRequest,
            );
        return fetchPlaceListResponse.placeDataList;
    }

    /**
     * レースデータを取得する
     * S3から取得する場合はstorage、Webから取得する場合はwebを指定する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    private async getRaceDataList(
        startDate: Date,
        finishDate: Date,
        placeList: JraPlaceData[],
        type: 'storage' | 'web',
    ): Promise<JraRaceData[]> {
        const fetchRaceListRequest = new FetchRaceListRequest<JraPlaceData>(
            startDate,
            finishDate,
            placeList,
        );
        const fetchRaceListResponse: FetchRaceListResponse<JraRaceData> =
            type === 'storage'
                ? await this.jraRaceRepositoryFromS3.fetchRaceList(
                      fetchRaceListRequest,
                  )
                : await this.jraRaceRepositoryFromHtml.fetchRaceList(
                      fetchRaceListRequest,
                  );
        return fetchRaceListResponse.raceDataList;
    }

    /**
     * レースデータを登録する
     *
     * @param raceList
     */
    @Logger
    private async registerRaceDataList(raceList: JraRaceData[]): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<JraRaceData>(raceList);
        await this.jraRaceRepositoryFromS3.registerRaceList(
            registerRaceListRequest,
        );
    }
}
