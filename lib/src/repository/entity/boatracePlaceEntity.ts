import type { BoatracePlaceData } from '../../domain/boatracePlaceData';
import type { BoatracePlaceId } from '../../utility/raceId';
import { generateBoatracePlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity ボートレースのレース開催場所データ
 */
export class BoatracePlaceEntity {
    /**
     * ID
     */
    public readonly id: BoatracePlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     */
    constructor(
        id: BoatracePlaceId | null,
        public readonly placeData: BoatracePlaceData,
    ) {
        this.id =
            id ??
            generateBoatracePlaceId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<BoatracePlaceEntity> = {}): BoatracePlaceEntity {
        return new BoatracePlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
        );
    }
}
