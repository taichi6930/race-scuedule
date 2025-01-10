import type {
    JraHeldDayTimes,
    JraHeldTimes,
    JraRaceCourse,
} from '../utility/data/jra';

/**
 * JRAのレース開催場所データ
 */
export class JraPlaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * JRAのレース開催場所を生成する
     * 開催場所の型はJraRaceCourseを使用しているのでValidationは現時点で不要
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     */
    constructor(
        public readonly dateTime: Date,
        public readonly location: JraRaceCourse,
        public readonly heldTimes: JraHeldTimes,
        public readonly heldDayTimes: JraHeldDayTimes,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraPlaceData> = {}): JraPlaceData {
        return new JraPlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }
}
