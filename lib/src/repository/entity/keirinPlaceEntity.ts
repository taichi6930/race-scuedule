import type { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinPlaceRecord } from '../../gateway/record/keirinPlaceRecord';
import {
    type KeirinPlaceId,
    validateKeirinPlaceId,
} from '../../utility/data/keirin/keirinPlaceId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';

/**
 * Repository層のEntity 競輪のレース開催場所データ
 */
export class KeirinPlaceEntity {
    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: KeirinPlaceId,
        public readonly placeData: KeirinPlaceData,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    static create(
        id: string,
        placeData: KeirinPlaceData,
        updateDate: Date,
    ): KeirinPlaceEntity {
        return new KeirinPlaceEntity(
            validateKeirinPlaceId(id),
            placeData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinPlaceEntity> = {}): KeirinPlaceEntity {
        return KeirinPlaceEntity.create(
            partial.id ?? this.id,
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
