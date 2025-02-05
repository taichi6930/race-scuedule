import { inject, injectable } from 'tsyringe';

import { WorldRaceData } from '../../domain/worldRaceData';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { WorldGradeType } from '../../utility/data/world/worldGradeType';
import { WorldRaceCourse } from '../../utility/data/world/worldRaceCourse';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 海外競馬場開催データUseCase
 */
@injectable()
export class WorldRaceDataUseCase
    implements
        IRaceDataUseCase<
            WorldRaceData,
            WorldGradeType,
            WorldRaceCourse,
            undefined
        >
{
    constructor(
        @inject('WorldRaceDataService')
        private readonly worldRaceDataService: IRaceDataService<
            WorldRaceEntity,
            WorldPlaceEntity
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
            gradeList?: WorldGradeType[];
            locationList?: WorldRaceCourse[];
        },
    ): Promise<WorldRaceData[]> {
        // レースデータを取得する
        const raceEntityList: WorldRaceEntity[] =
            await this.worldRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        // レースデータをWorldRaceDataに変換する
        const raceDataList: WorldRaceData[] = raceEntityList.map(
            (raceEntity) => raceEntity.raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: WorldRaceData[] = raceDataList
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
        // レースデータを取得する
        const raceEntityList: WorldRaceEntity[] =
            await this.worldRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
            );
        // S3にデータを保存する
        await this.worldRaceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    async upsertRaceDataList(raceDataList: WorldRaceData[]): Promise<void> {
        // worldRaceDataをworldRaceEntityに変換する
        const raceEntityList: WorldRaceEntity[] = raceDataList.map(
            (raceData) =>
                new WorldRaceEntity(null, raceData, getJSTDate(new Date())),
        );
        // S3にデータを保存する
        await this.worldRaceDataService.updateRaceEntityList(raceEntityList);
    }
}
