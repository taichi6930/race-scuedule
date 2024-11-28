import type { JraPlaceData } from '../../domain/jraPlaceData';
import { generateJraPlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity 海外競馬のレース開催場所データ
 */
export class JraPlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催場所データを生成する
     * @param placeData - レース開催場所データ
     */
    constructor(
        id: string | null,
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
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(): JraPlaceData {
        return this.placeData;
    }
}
