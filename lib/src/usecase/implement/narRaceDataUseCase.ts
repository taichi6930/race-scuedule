import { injectable, inject } from 'tsyringe';
import { Logger } from '../../utility/logger';
import { NarPlaceData } from '../../domain/narPlaceData';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';
import { NarRaceData } from '../../domain/narRaceData';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';

/**
 * 競馬場開催データUseCase
 */
@injectable()
export class NarRaceDataUseCase implements IRaceDataUseCase<NarRaceData> {
    constructor(
        @inject('NarPlaceRepositoryFromS3')
        private readonly narPlaceRepositoryFromS3: IPlaceRepository<NarPlaceData>,
        @inject('NarRaceRepositoryFromS3')
        private readonly narRaceRepositoryFromS3: IRaceRepository<
            NarRaceData,
            NarPlaceData
        >,
        @inject('NarRaceRepositoryFromHtml')
        private readonly narRaceRepositoryFromHtml: IRaceRepository<
            NarRaceData,
            NarPlaceData
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
    ): Promise<NarRaceData[]> {
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
    ): Promise<NarPlaceData[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<NarPlaceData> =
            await this.narPlaceRepositoryFromS3.fetchPlaceList(
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
        placeList: NarPlaceData[],
        type: 'storage' | 'web',
    ): Promise<NarRaceData[]> {
        const fetchRaceListRequest = new FetchRaceListRequest<NarPlaceData>(
            startDate,
            finishDate,
            placeList,
        );
        const fetchRaceListResponse: FetchRaceListResponse<NarRaceData> =
            type === 'storage'
                ? await this.narRaceRepositoryFromS3.fetchRaceList(
                      fetchRaceListRequest,
                  )
                : await this.narRaceRepositoryFromHtml.fetchRaceList(
                      fetchRaceListRequest,
                  );
        return fetchRaceListResponse.raceDataList;
    }

    /**
     * レースデータを登録する
     *
     * @param raceDataList
     */
    @Logger
    private async registerRaceDataList(raceList: NarRaceData[]): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<NarRaceData>(raceList);
        await this.narRaceRepositoryFromS3.registerRaceList(
            registerRaceListRequest,
        );
    }
}
