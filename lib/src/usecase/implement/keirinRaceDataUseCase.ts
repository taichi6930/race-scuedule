import { inject, injectable } from 'tsyringe';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { KeirinGradeType, KeirinRaceCourse } from '../../utility/data/keirin';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 競輪場開催データUseCase
 */
@injectable()
export class KeirinRaceDataUseCase
    implements
        IRaceDataUseCase<KeirinRaceData, KeirinGradeType, KeirinRaceCourse>
{
    constructor(
        @inject('KeirinPlaceRepositoryFromStorage')
        private readonly keirinPlaceRepositoryFromStorage: IPlaceRepository<KeirinPlaceEntity>,
        @inject('KeirinRaceRepositoryFromStorage')
        private readonly keirinRaceRepositoryFromStorage: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromHtml')
        private readonly keirinRaceRepositoryFromHtml: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
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
        searchList?: {
            gradeList?: KeirinGradeType[];
            locationList?: KeirinRaceCourse[];
        },
    ): Promise<KeirinRaceData[]> {
        // 競馬場データを取得する
        const placeList = await this.getPlaceDataList(startDate, finishDate);

        // レースデータを取得する
        const raceEntityList = await this.getRaceDataList(
            startDate,
            finishDate,
            placeList,
            'storage',
        );

        // レースデータをNarRaceDataに変換する
        const raceDataList = raceEntityList.map((raceEntity) => {
            return raceEntity.toDomainData();
        });

        // フィルタリング処理
        const filteredRaceDataList = raceDataList
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // 競馬場が指定されている場合は、指定された競馬場のレースのみを取得する
            .filter((raceData) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(raceData.location);
                }
                return true;
            });

        return filteredRaceDataList;
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

            console.log('レースデータを登録する');
            // S3にデータを保存する
            await this.registerRaceDataList(raceList);
        } catch (error) {
            console.error('レースデータの更新中にエラーが発生しました:', error);
        }
    }

    /**
     * レース開催データを更新する
     * @param raceList
     */
    @Logger
    async upsertRaceDataList(raceList: KeirinRaceData[]): Promise<void> {
        try {
            // jraRaceDataをJraRaceEntityに変換する
            const raceEntityList = raceList.map((raceData) => {
                return new KeirinRaceEntity(null, raceData, []);
            });
            // S3にデータを保存する
            await this.registerRaceDataList(raceEntityList);
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
    ): Promise<KeirinPlaceEntity[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<KeirinPlaceEntity> =
            await this.keirinPlaceRepositoryFromStorage.fetchPlaceList(
                fetchPlaceListRequest,
            );
        // KeirinPlaceEntityをKeirinPlaceDataに変換する
        return fetchPlaceListResponse.placeDataList;
    }

    /**
     * レースデータを取得する
     * S3から取得する場合はstorage、Webから取得する場合はwebを指定する
     *
     * @param startDate
     * @param finishDate
     * @param placeList
     * @param type
     */
    @Logger
    private async getRaceDataList(
        startDate: Date,
        finishDate: Date,
        placeList: KeirinPlaceEntity[],
        type: 'storage' | 'web',
    ): Promise<KeirinRaceEntity[]> {
        const fetchRaceListRequest =
            new FetchRaceListRequest<KeirinPlaceEntity>(
                startDate,
                finishDate,
                placeList,
            );
        const fetchRaceListResponse: FetchRaceListResponse<KeirinRaceEntity> =
            type === 'storage'
                ? await this.keirinRaceRepositoryFromStorage.fetchRaceList(
                      fetchRaceListRequest,
                  )
                : await this.keirinRaceRepositoryFromHtml.fetchRaceList(
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
    private async registerRaceDataList(
        raceList: KeirinRaceEntity[],
    ): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<KeirinRaceEntity>(raceList);
        await this.keirinRaceRepositoryFromStorage.registerRaceList(
            registerRaceListRequest,
        );
    }
}
