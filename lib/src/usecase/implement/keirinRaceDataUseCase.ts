import { inject, injectable } from 'tsyringe';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import { KeirinRaceCourse } from '../../utility/data/keirin/keirinRaceCourse';
import { KeirinRaceStage } from '../../utility/data/keirin/keirinRaceStage';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 競輪場開催データUseCase
 */
@injectable()
export class KeirinRaceDataUseCase
    implements
        IRaceDataUseCase<
            KeirinRaceData,
            KeirinGradeType,
            KeirinRaceCourse,
            KeirinRaceStage
        >
{
    constructor(
        @inject('KeirinPlaceDataService')
        private readonly keirinPlaceDataService: IPlaceDataService<KeirinPlaceEntity>,
        @inject('KeirinRaceDataService')
        private readonly keirinRaceDataService: IRaceDataService<
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
            stageList?: KeirinRaceStage[];
        },
    ): Promise<KeirinRaceData[]> {
        // 競輪場データを取得する
        const placeEntityList: KeirinPlaceEntity[] =
            await this.keirinPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

        // レースデータを取得する
        const raceEntityList: KeirinRaceEntity[] =
            await this.keirinRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                'storage',
                placeEntityList,
            );

        // レースデータをRaceDataに変換する
        const raceDataList: KeirinRaceData[] = raceEntityList.map(
            (raceEntity) => raceEntity.raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: KeirinRaceData[] = raceDataList
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // 競輪場が指定されている場合は、指定された競輪場のレースのみを取得する
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
            gradeList?: KeirinGradeType[];
            locationList?: KeirinRaceCourse[];
        },
    ): Promise<void> {
        // 競輪場データを取得する
        // フィルタリング処理
        const placeEntityList: KeirinPlaceEntity[] = (
            await this.keirinPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            )
        )
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

        // レースデータを取得する
        const raceEntityList: KeirinRaceEntity[] =
            await this.keirinRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                'web',
                placeEntityList,
            );

        // S3にデータを保存する
        await this.keirinRaceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    async upsertRaceDataList(raceDataList: KeirinRaceData[]): Promise<void> {
        // KeirinRaceDataをKeirinRaceEntityに変換する
        const raceEntityList: KeirinRaceEntity[] = raceDataList.map(
            (raceData) =>
                new KeirinRaceEntity(
                    null,
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
        );
        // S3にデータを保存する
        await this.keirinRaceDataService.updateRaceEntityList(raceEntityList);
    }
}
