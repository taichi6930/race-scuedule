import {
    type NarGradeType,
    validateNarGradeType,
} from '../utility/data/nar/narGradeType';
import {
    type NarRaceCourse,
    validateNarRaceCourse,
} from '../utility/data/nar/narRaceCourse';
import {
    type NarRaceCourseType,
    validateNarRaceCourseType,
} from '../utility/data/nar/narRaceCourseType';
import { validateNarRaceDate } from '../utility/data/nar/narRaceDate';
import type { NarRaceDateTime } from '../utility/data/nar/narRaceDateTime';
import {
    type NarRaceDistance,
    validateNarRaceDistance,
} from '../utility/data/nar/narRaceDistance';
import {
    type NarRaceName,
    validateNarRaceName,
} from '../utility/data/nar/narRaceName';
import {
    type NarRaceNumber,
    validateNarRaceNumber,
} from '../utility/data/nar/narRaceNumber';

/**
 * 地方競馬のレース開催データ
 */
export class NarRaceData {
    // レース名
    public readonly name: NarRaceName;
    // 開催日程
    public readonly dateTime: NarRaceDateTime;
    // 開催場所
    public readonly location: NarRaceCourse;
    // 馬場種別
    public readonly surfaceType: NarRaceCourseType;
    // 距離
    public readonly distance: NarRaceDistance;
    // グレード
    public readonly grade: NarGradeType;
    // レース番号
    public readonly number: NarRaceNumber;

    /**
     * コンストラクタ
     *
     * @remarks
     * 地方競馬のレース開催データを生成する
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     */
    private constructor(
        name: NarRaceName,
        dateTime: NarRaceDateTime,
        location: NarRaceCourse,
        surfaceType: NarRaceCourseType,
        distance: NarRaceDistance,
        grade: NarGradeType,
        number: NarRaceNumber,
    ) {
        this.name = name;
        this.dateTime = dateTime;
        this.location = location;
        this.surfaceType = surfaceType;
        this.distance = distance;
        this.grade = grade;
        this.number = number;
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
    ): NarRaceData {
        return new NarRaceData(
            validateNarRaceName(name),
            validateNarRaceDate(dateTime),
            validateNarRaceCourse(location),
            validateNarRaceCourseType(surfaceType),
            validateNarRaceDistance(distance),
            validateNarGradeType(grade),
            validateNarRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarRaceData> = {}): NarRaceData {
        return new NarRaceData(
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
