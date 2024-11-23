import type { RaceData } from '../../domain/baseData';
import type { GradeType, RaceCourse } from '../../utility/data/base';

/**
 * レースデータUseCaseのインターフェース
 */
export interface IRaceDataUseCase<
    R extends RaceData,
    G extends GradeType,
    C extends RaceCourse,
> {
    /**
     * レースデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchRaceDataList: (
        startDate: Date,
        finishDate: Date,
        gradeList?: G[],
        locationList?: C[],
    ) => Promise<R[]>;

    /**
     * レースデータのリストを更新する
     * @param startDate
     * @param finishDate
     */
    updateRaceDataList: (startDate: Date, finishDate: Date) => Promise<void>;

    /**
     * レースデータのリストを更新する
     * @param raceList
     */
    upsertRaceDataList: (raceList: R[]) => Promise<void>;
}
