import { NarPlaceData } from '../../domain/narPlaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import type { NarRaceCourse } from '../../utility/data/nar/narRaceCourse';
import type { NarRaceDate } from '../../utility/data/nar/narRaceDate';
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
     * @param updateDate - 更新日時
     */
    constructor(
        public readonly id: NarPlaceId,
        public readonly dateTime: NarRaceDate,
        public readonly location: NarRaceCourse,
        public readonly updateDate: Date,
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
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * NarPlaceEntityに変換する
     * @returns
     */
    toEntity(): NarPlaceEntity {
        return new NarPlaceEntity(
            this.id,
            NarPlaceData.create(this.dateTime, this.location),
            this.updateDate,
        );
    }
}
