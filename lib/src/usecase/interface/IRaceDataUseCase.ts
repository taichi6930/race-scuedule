import type { RaceData } from '../../domain/baseData';
import type { JraGradeType, JraRaceCourse } from '../../utility/data/jra';

/**
 * レースデータUseCaseのインターフェース
 */
export interface IRaceDataUseCase<R extends RaceData> {
    /**
     * レースデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchRaceDataList: (
        startDate: Date,
        finishDate: Date,
        gradeList?: JraGradeType[],
        locationList?: JraRaceCourse[],
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
