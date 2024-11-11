import { format } from 'date-fns';

import { WorldPlaceData } from '../../domain/worldPlaceData';
import type { WorldRaceCourse } from '../../utility/data/raceSpecific';
import { WORLD_PLACE_CODE } from '../../utility/data/world';

/**
 * Repository層のEntity 海外競馬のレース開催場所データ
 */
export class WorldPlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    constructor(
        id: string | null,
        public readonly dateTime: Date,
        public readonly location: WorldRaceCourse,
    ) {
        this.id = id ?? this.generateId(dateTime, location);
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

    /**
     * IDを生成する
     *
     * @private
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @returns 生成されたID
     */
    private generateId(dateTime: Date, location: WorldRaceCourse): string {
        return `world${format(dateTime, 'yyyyMMdd')}${WORLD_PLACE_CODE[location]}`;
    }
}
