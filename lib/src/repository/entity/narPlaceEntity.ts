import type { NarPlaceData } from '../../domain/narPlaceData';
import type { NarPlaceId } from '../../utility/raceId';
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
     */
    constructor(
        id: NarPlaceId | null,
        public readonly placeData: NarPlaceData,
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
        );
    }
}
