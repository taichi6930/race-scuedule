import type { NarRaceCourse } from '../../utility/data/nar';
import type { NarPlaceId } from '../../utility/raceId';

/**
 * Repository層のRecord 地方競馬のレース開催場所データ
 */
export class NarPlaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 地方競馬のレース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    constructor(
        public readonly id: NarPlaceId,
        public readonly dateTime: Date,
        public readonly location: NarRaceCourse,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarPlaceRecord> = {}): NarPlaceRecord {
        return new NarPlaceRecord(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
