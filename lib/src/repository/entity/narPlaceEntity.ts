import { format } from 'date-fns';

import { NarPlaceData } from '../../domain/narPlaceData';
import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';
import type { NarRaceCourse } from '../../utility/data/raceSpecific';

/**
 * Repository層のEntity 地方競馬のレース開催場所データ
 */
export class NarPlaceEntity {
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
        public readonly location: NarRaceCourse,
    ) {
        this.id = id ?? this.generateId(dateTime, location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarPlaceEntity> = {}): NarPlaceEntity {
        return new NarPlaceEntity(
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
    toDomainData(partial: Partial<NarPlaceEntity> = {}): NarPlaceData {
        return new NarPlaceData(
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
    private generateId(dateTime: Date, location: NarRaceCourse): string {
        return `nar${format(dateTime, 'yyyyMMdd')}${NETKEIBA_BABACODE[location]}`;
    }
}
