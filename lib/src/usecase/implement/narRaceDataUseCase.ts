import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { NarGradeType } from '../../utility/data/nar/narGradeType';
import { NarRaceCourse } from '../../utility/data/nar/narRaceCourse';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
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
        @inject('NarPlaceDataService')
        private readonly narPlaceDataService: IPlaceDataService<NarPlaceEntity>,
        @inject('NarRaceDataService')
        private readonly narRaceDataService: IRaceDataService<
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
        const placeEntityList: NarPlaceEntity[] =
            await this.narPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        // レースデータを取得する
        const raceEntityList: NarRaceEntity[] =
            await this.narRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
                placeEntityList,
            );

        // レースデータをNarRaceDataに変換する
        const raceDataList: NarRaceData[] = raceEntityList.map(
            (raceEntity) => raceEntity.raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: NarRaceData[] = raceDataList
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
        const placeEntityList: NarPlaceEntity[] =
            await this.narPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        // レースデータを取得する
        const raceEntityList: NarRaceEntity[] =
            await this.narRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
                placeEntityList,
            );

        // S3にデータを保存する
        await this.narRaceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    async upsertRaceDataList(raceDataList: NarRaceData[]): Promise<void> {
        // NarRaceDataをNarRaceEntityに変換する
        const raceEntityList: NarRaceEntity[] = raceDataList.map(
            (raceData) =>
                new NarRaceEntity(null, raceData, getJSTDate(new Date())),
        );
        // S3にデータを保存する
        await this.narRaceDataService.updateRaceEntityList(raceEntityList);
    }
}
