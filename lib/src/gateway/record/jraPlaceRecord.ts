import type { JraRaceCourse } from '../../utility/data/jra';
import type { JraPlaceId } from '../../utility/raceId';

/**
 * Repository層のRecord 中央競馬のレース開催場所データ
 */
export class JraPlaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 中央競馬のレース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     */
    constructor(
        public readonly id: JraPlaceId,
        public readonly dateTime: Date,
        public readonly location: JraRaceCourse,
        public readonly heldTimes: number,
        public readonly heldDayTimes: number,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraPlaceRecord> = {}): JraPlaceRecord {
        return new JraPlaceRecord(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }
}
