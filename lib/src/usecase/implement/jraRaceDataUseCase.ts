import { inject, injectable } from 'tsyringe';

import { JraRaceData } from '../../domain/jraRaceData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { JraGradeType, JraRaceCourse } from '../../utility/data/jra';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 競馬場開催データUseCase
 */
@injectable()
export class JraRaceDataUseCase
    implements
        IRaceDataUseCase<JraRaceData, JraGradeType, JraRaceCourse, undefined>
{
    constructor(
        @inject('JraPlaceRepositoryFromStorage')
        private readonly jraPlaceRepositoryFromStorage: IPlaceRepository<JraPlaceEntity>,
        @inject('JraRaceRepositoryFromStorage')
        private readonly jraRaceRepositoryFromStorage: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >,
        @inject('JraRaceRepositoryFromHtml')
        private readonly jraRaceRepositoryFromHtml: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >,
    ) {}

    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     */
    async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: JraGradeType[];
            locationList?: JraRaceCourse[];
        },
    ): Promise<JraRaceData[]> {
        // 競馬場データを取得する
        const placeEntityList: JraPlaceEntity[] = await this.getPlaceEntityList(
            startDate,
            finishDate,
        );

        // レースデータを取得する
        const raceEntityList: JraRaceEntity[] = await this.getRaceEntityList(
            startDate,
            finishDate,
            placeEntityList,
            'storage',
        );

        // レースデータをJraRaceDataに変換する
        const raceDataList: JraRaceData[] = raceEntityList.map(
            (raceEntity) => raceEntity.raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: JraRaceData[] = raceDataList
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
    async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<void> {
        try {
            // 競馬場データを取得する
            const placeEntityList: JraPlaceEntity[] =
                await this.getPlaceEntityList(startDate, finishDate);

            // レースデータを取得する
            const raceEntityList: JraRaceEntity[] =
                await this.getRaceEntityList(
                    startDate,
                    finishDate,
                    placeEntityList,
                    'web',
                );

            // S3にデータを保存する
            await this.registerRaceEntityList(raceEntityList);
        } catch (error) {
            console.error('レースデータの更新中にエラーが発生しました:', error);
        }
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    async upsertRaceDataList(raceDataList: JraRaceData[]): Promise<void> {
        try {
            // jraRaceDataをJraRaceEntityに変換する
            const raceEntityList: JraRaceEntity[] = raceDataList.map(
                (raceData) => new JraRaceEntity(null, raceData),
            );
            // S3にデータを保存する
            await this.registerRaceEntityList(raceEntityList);
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
    private async getPlaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<JraPlaceEntity[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<JraPlaceEntity> =
            await this.jraPlaceRepositoryFromStorage.fetchPlaceEntityList(
                fetchPlaceListRequest,
            );
        return fetchPlaceListResponse.placeEntityList;
    }

    /**
     * レースデータを取得する
     * S3から取得する場合はstorage、Webから取得する場合はwebを指定する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    private async getRaceEntityList(
        startDate: Date,
        finishDate: Date,
        placeEntityList: JraPlaceEntity[],
        type: 'storage' | 'web',
    ): Promise<JraRaceEntity[]> {
        const fetchRaceListRequest = new FetchRaceListRequest<JraPlaceEntity>(
            startDate,
            finishDate,
            placeEntityList,
        );
        const repository =
            type === 'storage'
                ? this.jraRaceRepositoryFromStorage
                : this.jraRaceRepositoryFromHtml;

        const fetchRaceListResponse: FetchRaceListResponse<JraRaceEntity> =
            await repository.fetchRaceEntityList(fetchRaceListRequest);
        return fetchRaceListResponse.raceEntityList;
    }

    /**
     * レースデータを登録する
     *
     * @param raceList
     */
    @Logger
    private async registerRaceEntityList(
        raceEntityList: JraRaceEntity[],
    ): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<JraRaceEntity>(raceEntityList);
        await this.jraRaceRepositoryFromStorage.registerRaceEntityList(
            registerRaceListRequest,
        );
    }
}
