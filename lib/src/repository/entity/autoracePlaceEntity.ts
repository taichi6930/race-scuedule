import type { AutoracePlaceData } from '../../domain/autoracePlaceData';
import type { AutoracePlaceId } from '../../utility/raceId';
import { generateAutoracePlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity オートレース場のレース開催場所データ
 */
export class AutoracePlaceEntity {
    /**
     * ID
     */
    public readonly id: AutoracePlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * オートレース場のレース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     */
    constructor(
        id: AutoracePlaceId | null,
        public readonly placeData: AutoracePlaceData,
    ) {
        this.id =
            id ??
            generateAutoracePlaceId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoracePlaceEntity> = {}): AutoracePlaceEntity {
        return new AutoracePlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
        );
    }

    /**
     * データ型に変換する
     * @returns
     */
    toDomainData = (): AutoracePlaceData => this.placeData;
}
