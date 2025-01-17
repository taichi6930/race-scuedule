import type { NarPlaceData } from '../../domain/narPlaceData';
import { NarPlaceRecord } from '../../gateway/record/narPlaceRecord';
import type { NarPlaceId } from '../../utility/data/nar/narPlaceId';
import { generateNarPlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity 地方競馬のレース開催場所データ
 */
export class NarPlaceEntity {
    /**
     * ID
     */
    public readonly id: NarPlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 地方競馬のレース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    constructor(
        id: NarPlaceId | null,
        public readonly placeData: NarPlaceData,
        public readonly updateDate: Date,
    ) {
        this.id =
            id ?? generateNarPlaceId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarPlaceEntity> = {}): NarPlaceEntity {
        return new NarPlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * NarPlaceRecordに変換する
     * @returns
     */
    toRecord(): NarPlaceRecord {
        return NarPlaceRecord.create(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.updateDate,
        );
    }
}
