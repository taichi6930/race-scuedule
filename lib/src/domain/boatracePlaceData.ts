import type { BoatraceGradeType } from '../utility/data/boatrace/boatraceGradeType';
import { validateBoatraceGradeType } from '../utility/data/boatrace/boatraceGradeType';
import type { BoatraceRaceCourse } from '../utility/data/boatrace/boatraceRaceCourse';
import { validateBoatraceRaceCourse } from '../utility/data/boatrace/boatraceRaceCourse';
import type { BoatraceRaceDate } from '../utility/data/boatrace/boatraceRaceDate';
import { validateBoatraceRaceDate } from '../utility/data/boatrace/boatraceRaceDate';
import type { IPlaceData } from './iPlaceData';

/**
 * ボートレースのレース開催場所データ
 */
export class BoatracePlaceData implements IPlaceData<BoatracePlaceData> {
    /**
     * 開催日時
     *
     * @type {BoatraceRaceDate}
     * @memberof BoatracePlaceData
     */
    public readonly dateTime: BoatraceRaceDate;
    /**
     * 開催場所
     *
     * @type {BoatraceRaceCourse}
     * @memberof BoatracePlaceData
     */
    public readonly location: BoatraceRaceCourse;
    /**
     * グレード
     *
     * @type {BoatraceGradeType}
     * @memberof BoatracePlaceData
     */
    public readonly grade: BoatraceGradeType;

    /**
     * コンストラクタ
     *
     * @remarks
     * レース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     */
    private constructor(
        dateTime: BoatraceRaceDate,
        location: BoatraceRaceCourse,
        grade: BoatraceGradeType,
    ) {
        this.dateTime = dateTime;
        this.location = location;
        this.grade = grade;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     */
    static create(
        dateTime: Date,
        location: string,
        grade: string,
    ): BoatracePlaceData {
        return new BoatracePlaceData(
            validateBoatraceRaceDate(dateTime),
            validateBoatraceRaceCourse(location),
            validateBoatraceGradeType(grade),
        );
    }
    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいBoatracePlaceDataインスタンス
     */
    copy(partial: Partial<BoatracePlaceData> = {}): BoatracePlaceData {
        return new BoatracePlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
