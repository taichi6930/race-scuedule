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
    implements IRaceDataUseCase<JraRaceData, JraGradeType, JraRaceCourse>
{
    constructor(
        @inject('JraPlaceRepositoryFromS3')
        private readonly jraPlaceRepositoryFromS3: IPlaceRepository<JraPlaceEntity>,
        @inject('JraRaceRepositoryFromS3')
        private readonly jraRaceRepositoryFromS3: IRaceRepository<
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
    async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        gradeList?: JraGradeType[],
        locationList?: JraRaceCourse[],
    ): Promise<JraRaceData[]> {
        // 競馬場データを取得する
        const placeList = await this.getPlaceDataList(startDate, finishDate);

        // レースデータを取得する
        return (
            (
                await this.getRaceDataList(
                    startDate,
                    finishDate,
                    placeList,
                    'storage',
                )
            )
                .map((raceEntity) => {
                    return raceEntity.toDomainData();
                })
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceData) => {
                    if (gradeList) {
                        return gradeList.includes(raceData.grade);
                    }
                    return true;
                })
                // 競馬場が指定されている場合は、指定された競馬場のレースのみを取得する
                .filter((raceData) => {
                    if (locationList) {
                        return locationList.includes(raceData.location);
                    }
                    return true;
                })
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
     * レース開催データを更新する
     * @param raceList
     */
    @Logger
    async upsertRaceDataList(raceList: JraRaceData[]): Promise<void> {
        try {
            // jraRaceDataをJraRaceEntityに変換する
            const raceEntityList = raceList.map((raceData) => {
                return new JraRaceEntity(
                    null,
                    raceData.name,
                    raceData.dateTime,
                    raceData.location,
                    raceData.surfaceType,
                    raceData.distance,
                    raceData.grade,
                    raceData.number,
                    raceData.heldTimes,
                    raceData.heldDayTimes,
                );
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
    ): Promise<JraPlaceEntity[]> {
        const fetchPlaceListRequest: FetchPlaceListRequest =
            new FetchPlaceListRequest(startDate, finishDate);
        const fetchPlaceListResponse: FetchPlaceListResponse<JraPlaceEntity> =
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
        placeList: JraPlaceEntity[],
        type: 'storage' | 'web',
    ): Promise<JraRaceEntity[]> {
        const fetchRaceListRequest = new FetchRaceListRequest<JraPlaceEntity>(
            startDate,
            finishDate,
            placeList,
        );
        const fetchRaceListResponse: FetchRaceListResponse<JraRaceEntity> =
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
    private async registerRaceDataList(
        raceList: JraRaceEntity[],
    ): Promise<void> {
        const registerRaceListRequest =
            new RegisterRaceListRequest<JraRaceEntity>(raceList);
        await this.jraRaceRepositoryFromS3.registerRaceList(
            registerRaceListRequest,
        );
    }
}
