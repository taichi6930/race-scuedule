import type { WorldPlaceData } from '../../domain/worldPlaceData';
import type { WorldPlaceId } from '../../utility/raceId';
import { generateWorldPlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity 海外競馬のレース開催場所データ
 */
export class WorldPlaceEntity {
    /**
     * ID
     */
    public readonly id: WorldPlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 海外競馬のレース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     */
    constructor(
        id: WorldPlaceId | null,
        public readonly placeData: WorldPlaceData,
    ) {
        this.id =
            id ?? generateWorldPlaceId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<WorldPlaceEntity> = {}): WorldPlaceEntity {
        return new WorldPlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
        );
    }
}
