import type { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoracePlaceRecord } from '../../gateway/record/autoracePlaceRecord';
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
     * AutoracePlaceRecordに変換する
     * @returns
     */
    toRecord(): AutoracePlaceRecord {
        return new AutoracePlaceRecord(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.grade,
        );
    }
}
