import { inject, injectable } from 'tsyringe';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { AutoraceGradeType } from '../../utility/data/autorace/autoraceGradeType';
import { AutoraceRaceCourse } from '../../utility/data/autorace/autoraceRaceCourse';
import { AutoraceRaceStage } from '../../utility/data/autorace/autoraceRaceStage';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Autoraceのレース情報を取得するユースケース
 */
@injectable()
export class AutoraceRaceDataUseCase
    implements
        IRaceDataUseCase<
            AutoraceRaceData,
            AutoraceGradeType,
            AutoraceRaceCourse,
            AutoraceRaceStage
        >
{
    constructor(
        @inject('AutoracePlaceDataService')
        private readonly autoracePlaceDataService: IPlaceDataService<AutoracePlaceEntity>,
        @inject('AutoraceRaceDataService')
        private readonly autoraceRaceDataService: IRaceDataService<
            AutoraceRaceEntity,
            AutoracePlaceEntity
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
            gradeList?: AutoraceGradeType[];
            locationList?: AutoraceRaceCourse[];
            stageList?: AutoraceRaceStage[];
        },
    ): Promise<AutoraceRaceData[]> {
        const placeEntityList: AutoracePlaceEntity[] =
            await this.autoracePlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const raceEntityList: AutoraceRaceEntity[] =
            await this.autoraceRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
                placeEntityList,
            );

        const raceDataList: AutoraceRaceData[] = raceEntityList.map(
            (raceEntity) => raceEntity.raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: AutoraceRaceData[] = raceDataList
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // 開催場所が指定されている場合は、指定された開催場所のレースのみを取得する
            .filter((raceData) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(raceData.location);
                }
                return true;
            })
            // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.stageList) {
                    return searchList.stageList.includes(raceData.stage);
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
        searchList?: {
            gradeList?: AutoraceGradeType[];
            locationList?: AutoraceRaceCourse[];
        },
    ): Promise<void> {
        const placeEntityList: AutoracePlaceEntity[] = (
            await this.autoracePlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            )
        )
            // 検索条件に合致する場所のみを取得する
            ?.filter((placeEntity) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(
                        placeEntity.placeData.grade,
                    );
                }
                return true;
            })
            ?.filter((placeEntity) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(
                        placeEntity.placeData.location,
                    );
                }
                return true;
            });

        // placeEntityListが空の場合は処理を終了する
        if (placeEntityList.length === 0) {
            return;
        }

        const raceEntityList: AutoraceRaceEntity[] =
            await this.autoraceRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
                placeEntityList,
            );

        await this.autoraceRaceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    async upsertRaceDataList(raceDataList: AutoraceRaceData[]): Promise<void> {
        const raceEntityList: AutoraceRaceEntity[] = raceDataList.map(
            (raceData) =>
                new AutoraceRaceEntity(
                    null,
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
        );
        await this.autoraceRaceDataService.updateRaceEntityList(raceEntityList);
    }
}
