import type { KeirinGradeType } from '../utility/data/keirin/keirinGradeType';
import { validateKeirinGradeType } from '../utility/data/keirin/keirinGradeType';
import type { KeirinRaceCourse } from '../utility/data/keirin/keirinRaceCourse';
import { validateKeirinRaceCourse } from '../utility/data/keirin/keirinRaceCourse';
import type { KeirinRaceDate } from '../utility/data/keirin/keirinRaceDate';
import { validateKeirinRaceDate } from '../utility/data/keirin/keirinRaceDate';

/**
 * 競輪のレース開催場所データ
 */
export class KeirinPlaceData {
    /**
     * 開催日
     *
     * @type {KeirinRaceDate}
     * @memberof KeirinPlaceData
     */
    public readonly dateTime: KeirinRaceDate;
    /**
     * 開催場所
     *
     * @type {KeirinRaceCourse}
     * @memberof KeirinPlaceData
     */
    public readonly location: KeirinRaceCourse;
    /**
     * グレード
     *
     * @type {KeirinGradeType}
     * @memberof KeirinPlaceData
     */
    public readonly grade: KeirinGradeType;

    /**
     * コンストラクタ
     * @param dateTime
     * @param location
     * @param grade
     */
    private constructor(
        dateTime: KeirinRaceDate,
        location: KeirinRaceCourse,
        grade: KeirinGradeType,
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
    ): KeirinPlaceData {
        return new KeirinPlaceData(
            validateKeirinRaceDate(dateTime),
            validateKeirinRaceCourse(location),
            validateKeirinGradeType(grade),
        );
    }
    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいKeirinPlaceDataインスタンス
     */
    copy(partial: Partial<KeirinPlaceData> = {}): KeirinPlaceData {
        return new KeirinPlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
