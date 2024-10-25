import { format } from 'date-fns';

import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';
import type { NarRaceCourse } from '../../utility/data/raceSpecific';

/**
 * Repository層のEntity 競輪のレース開催場所データ
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
     * 地方競馬のレース開催場所データを生成する
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
