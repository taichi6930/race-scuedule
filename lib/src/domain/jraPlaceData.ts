import type { JraRaceCourse } from '../utility/data/jra';

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
     */
    constructor(
        public readonly dateTime: Date,
        public readonly location: JraRaceCourse,
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
        );
    }
}
