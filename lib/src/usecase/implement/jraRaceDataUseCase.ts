import { inject, injectable } from 'tsyringe';

import { JraRaceData } from '../../domain/jraRaceData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { JraGradeType } from '../../utility/data/jra/jraGradeType';
import { JraRaceCourse } from '../../utility/data/jra/jraRaceCourse';
import { getJSTDate } from '../../utility/date';
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
        @inject('JraPlaceDataService')
        private readonly jraPlaceDataService: IPlaceDataService<JraPlaceEntity>,
        @inject('JraRaceDataService')
        private readonly jraRaceDataService: IRaceDataService<
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
        searchList?: {
            gradeList?: JraGradeType[];
            locationList?: JraRaceCourse[];
        },
    ): Promise<JraRaceData[]> {
        // 競馬場データを取得する
        const placeEntityList: JraPlaceEntity[] =
            await this.jraPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

        // レースデータを取得する
        const raceEntityList: JraRaceEntity[] =
            await this.jraRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                'storage',
                placeEntityList,
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
        // 競馬場データを取得する
        const placeEntityList: JraPlaceEntity[] =
            await this.jraPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

        // レースデータを取得する
        const raceEntityList: JraRaceEntity[] =
            await this.jraRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                'web',
                placeEntityList,
            );

        // S3にデータを保存する
        await this.jraRaceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    async upsertRaceDataList(raceDataList: JraRaceData[]): Promise<void> {
        // JraRaceDataをJraRaceEntityに変換する
        const raceEntityList: JraRaceEntity[] = raceDataList.map(
            (raceData) =>
                new JraRaceEntity(null, raceData, getJSTDate(new Date())),
        );
        // S3にデータを保存する
        await this.jraRaceDataService.updateRaceEntityList(raceEntityList);
    }
}
