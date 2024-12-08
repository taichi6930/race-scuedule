import type { JraPlaceData } from '../../domain/jraPlaceData';
import { JraPlaceRecord } from '../../gateway/record/jraPlaceRecord';
import type { JraPlaceId } from '../../utility/raceId';
import { generateJraPlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity 中央競馬のレース開催場所データ
 */
export class JraPlaceEntity {
    /**
     * ID
     */
    public readonly id: JraPlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 中央競馬のレース開催場所データを生成する
     * @param placeData - レース開催場所データ
     */
    constructor(
        id: JraPlaceId | null,
        public readonly placeData: JraPlaceData,
    ) {
        this.id =
            id ?? generateJraPlaceId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraPlaceEntity> = {}): JraPlaceEntity {
        return new JraPlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
        );
    }

    /**
     * JraPlaceRecordに変換する
     * @returns
     */
    toRecord(): JraPlaceRecord {
        return new JraPlaceRecord(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.heldTimes,
            this.placeData.heldDayTimes,
        );
    }
}
