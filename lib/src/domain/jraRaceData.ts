import {
    type JraGradeType,
    validateJraGradeType,
} from '../utility/data/jra/jraGradeType';
import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../utility/data/jra/jraHeldDayTimes';
import {
    type JraHeldTimes,
    validateJraHeldTimes,
} from '../utility/data/jra/jraHeldTimes';
import {
    type JraRaceCourse,
    validateJraRaceCourse,
} from '../utility/data/jra/jraRaceCourse';
import {
    type JraRaceCourseType,
    validateJraRaceCourseType,
} from '../utility/data/jra/jraRaceCourseType';
import { validateJraRaceDate } from '../utility/data/jra/jraRaceDate';
import type { JraRaceDateTime } from '../utility/data/jra/jraRaceDateTime';
import {
    type JraRaceDistance,
    validateJraRaceDistance,
} from '../utility/data/jra/jraRaceDistance';
import {
    type JraRaceName,
    validateJraRaceName,
} from '../utility/data/jra/jraRaceName';
import {
    type JraRaceNumber,
    validateJraRaceNumber,
} from '../utility/data/jra/jraRaceNumber';

/**
 * 中央競馬のレース開催データ
 */
export class JraRaceData {
    // レース名
    public readonly name: JraRaceName;
    // 開催日程
    public readonly dateTime: JraRaceDateTime;
    // 開催場所
    public readonly location: JraRaceCourse;
    // 馬場種別
    public readonly surfaceType: JraRaceCourseType;
    // 距離
    public readonly distance: JraRaceDistance;
    // グレード
    public readonly grade: JraGradeType;
    // レース番号
    public readonly number: JraRaceNumber;
    // 開催回数
    public readonly heldTimes: JraHeldTimes;
    // 開催日数
    public readonly heldDayTimes: JraHeldDayTimes;

    /**
     * コンストラクタ
     *
     * @remarks
     * 海外競馬のレース開催データを生成する
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     */
    private constructor(
        name: JraRaceName,
        dateTime: JraRaceDateTime,
        location: JraRaceCourse,
        surfaceType: JraRaceCourseType,
        distance: JraRaceDistance,
        grade: JraGradeType,
        number: JraRaceNumber,
        heldTimes: JraHeldTimes,
        heldDayTimes: JraHeldDayTimes,
    ) {
        this.name = name;
        this.dateTime = dateTime;
        this.location = location;
        this.surfaceType = surfaceType;
        this.distance = distance;
        this.grade = grade;
        this.number = number;
        this.heldTimes = heldTimes;
        this.heldDayTimes = heldDayTimes;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     */
    static create(
        name: string,
        dateTime: Date,
        location: string,
        surfaceType: string,
        distance: number,
        grade: string,
        number: number,
        heldTimes: number,
        heldDayTimes: number,
    ): JraRaceData {
        return new JraRaceData(
            validateJraRaceName(name),
            validateJraRaceDate(dateTime),
            validateJraRaceCourse(location),
            validateJraRaceCourseType(surfaceType),
            validateJraRaceDistance(distance),
            validateJraGradeType(grade),
            validateJraRaceNumber(number),
            validateJraHeldTimes(heldTimes),
            validateJraHeldDayTimes(heldDayTimes),
        );
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraRaceData> = {}): JraRaceData {
        return new JraRaceData(
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }
}
