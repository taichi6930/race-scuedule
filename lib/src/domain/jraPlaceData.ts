import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../utility/data/jra/jraHeldDayTimes';
import {
    type JraHeldTimes,
    validateJraHeldTimes,
} from '../utility/data/jra/jraHeldTimes';
import type { JraRaceCourse } from '../utility/data/jra/jraRaceCourse';
import { validateJraRaceCourse } from '../utility/data/jra/jraRaceCourse';
import type { JraRaceDate } from '../utility/data/jra/jraRaceDate';
import { validateJraRaceDate } from '../utility/data/jra/jraRaceDate';

/**
 * 中央競馬のレース開催場所データ
 */
export class JraPlaceData {
    // 開催日時
    public readonly dateTime: JraRaceDate;
    // 開催場所
    public readonly location: JraRaceCourse;
    // 開催回数
    public readonly heldTimes: JraHeldTimes;
    // 開催日数
    public readonly heldDayTimes: JraHeldDayTimes;

    private constructor(
        dateTime: JraRaceDate,
        location: JraRaceCourse,
        heldTimes: JraHeldTimes,
        heldDayTimes: JraHeldDayTimes,
    ) {
        this.dateTime = dateTime;
        this.location = location;
        this.heldTimes = heldTimes;
        this.heldDayTimes = heldDayTimes;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所 (バリデーション対象)
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param grade - オートレースのグレード (バリデーション対象)
     */
    static create(
        dateTime: Date,
        location: string,
        heldTimes: number,
        heldDayTimes: number,
    ): JraPlaceData {
        return new JraPlaceData(
            validateJraRaceDate(dateTime),
            validateJraRaceCourse(location),
            validateJraHeldTimes(heldTimes),
            validateJraHeldDayTimes(heldDayTimes),
        );
    }
    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいJraPlaceDataインスタンス
     */
    copy(partial: Partial<JraPlaceData> = {}): JraPlaceData {
        return JraPlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }
}
