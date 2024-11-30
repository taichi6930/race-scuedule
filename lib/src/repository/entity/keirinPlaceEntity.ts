import type { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { generateKeirinPlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity ボートレースのレース開催場所データ
 */
export class KeirinPlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     */
    constructor(
        id: string | null,
        public readonly placeData: KeirinPlaceData,
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
        );
    }

    /**
     * データ型に変換する
     * @returns
     */
    toDomainData = (): KeirinPlaceData => this.placeData;
}
