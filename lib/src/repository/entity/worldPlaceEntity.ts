import { WorldPlaceData } from '../../domain/worldPlaceData';
import type { WorldRaceCourse } from '../../utility/data/world';
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
     * 競輪のレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    constructor(
        id: WorldPlaceId | null,
        public readonly dateTime: Date,
        public readonly location: WorldRaceCourse,
    ) {
        this.id = id ?? generateWorldPlaceId(dateTime, location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<WorldPlaceEntity> = {}): WorldPlaceEntity {
        return new WorldPlaceEntity(
            partial.id ?? null,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }

    /**
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(partial: Partial<WorldPlaceEntity> = {}): WorldPlaceData {
        return new WorldPlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
