import type { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { generateBoatracePlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity ボートレースのレース開催場所データ
 */
export class BoatracePlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - ボートレースのグレード
     */
    constructor(
        id: string | null,
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

    /**
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(): BoatracePlaceData {
        return this.placeData;
    }
}
