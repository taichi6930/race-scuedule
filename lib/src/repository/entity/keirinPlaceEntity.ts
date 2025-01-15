import type { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinPlaceRecord } from '../../gateway/record/keirinPlaceRecord';
import type { KeirinPlaceId } from '../../utility/raceId';
import { generateKeirinPlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity 競輪のレース開催場所データ
 */
export class KeirinPlaceEntity {
    /**
     * ID
     */
    public readonly id: KeirinPlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    constructor(
        id: KeirinPlaceId | null,
        public readonly placeData: KeirinPlaceData,
        public readonly updateDate: Date,
    ) {
        this.id =
            id ?? generateKeirinPlaceId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinPlaceEntity> = {}): KeirinPlaceEntity {
        return new KeirinPlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * KeirinPlaceRecordに変換する
     * @returns
     */
    toRecord(): KeirinPlaceRecord {
        return KeirinPlaceRecord.create(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.grade,
            this.updateDate,
        );
    }
}
