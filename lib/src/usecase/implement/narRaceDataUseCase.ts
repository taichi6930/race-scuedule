import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchPlaceListResponse } from '../../repository/response/fetchPlaceListResponse';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { NarGradeType, NarRaceCourse } from '../../utility/data/nar';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 競馬場開催データUseCase
 */
@injectable()
export class NarRaceDataUseCase
    implements
        IRaceDataUseCase<NarRaceData, NarGradeType, NarRaceCourse, undefined>
{
    constructor(
        @inject('NarPlaceRepositoryFromS3')
        private readonly narPlaceRepositoryFromS3: IPlaceRepository<NarPlaceEntity>,
        @inject('NarRaceRepositoryFromS3')
        private readonly narRaceRepositoryFromS3: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >,
        @inject('NarRaceRepositoryFromHtml')
        private readonly narRaceRepositoryFromHtml: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
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
            gradeList?: NarGradeType[];
            locationList?: NarRaceCourse[];
        },
    ): Promise<NarRaceData[]> {
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
        const raceDataList = raceEntityList.map((raceEntity) =>
            raceEntity.toDomainData(),
        );

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
    async upsertRaceDataList(raceList: NarRaceData[]): Promise<void> {
        try {
            // NarRaceDataをNarRaceEntityに変換する
            const raceEntityList = raceList.map(
                (raceData) => new NarRaceEntity(null, raceData),
            );
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
    ): Promise<NarPlaceEntity[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<NarPlaceEntity> =
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
     * @param placeList
     * @param type
     */
    @Logger
    private async getRaceDataList(
        startDate: Date,
        finishDate: Date,
        placeList: NarPlaceEntity[],
        type: 'storage' | 'web',
    ): Promise<NarRaceEntity[]> {
        const fetchRaceListRequest = new FetchRaceListRequest<NarPlaceEntity>(
            startDate,
            finishDate,
            placeList,
        );
        const fetchRaceListResponse: FetchRaceListResponse<NarRaceEntity> =
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
     * @param raceList
     */
    @Logger
    private async registerRaceDataList(
        raceList: NarRaceEntity[],
    ): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<NarRaceEntity>(raceList);
        await this.narRaceRepositoryFromS3.registerRaceList(
            registerRaceListRequest,
        );
    }
}
