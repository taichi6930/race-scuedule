import '../../utility/format';

import { format } from 'date-fns';

import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';
import type {
    WorldGradeType,
    WorldRaceCourse,
    WorldRaceCourseType,
} from '../../utility/data/raceSpecific';

/**
 * 海外競馬のレース開催データ
 */
export class WorldRaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
     * @param id - ID
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     */
    constructor(
        id: string | null,
        public readonly name: string,
        public readonly dateTime: Date,
        public readonly location: WorldRaceCourse,
        public readonly surfaceType: WorldRaceCourseType,
        public readonly distance: number,
        public readonly grade: WorldGradeType,
        public readonly number: number,
    ) {
        this.id = id ?? this.generateId(dateTime, location, number);
    }

    /**
     * IDを生成する
     *
     * @private
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param number - レース番号
     * @returns 生成されたID
     */
    private generateId(
        dateTime: Date,
        location: WorldRaceCourse,
        number: number,
    ): string {
        return `world${format(dateTime, 'yyyyMMdd')}${NETKEIBA_BABACODE[location]}${number.toXDigits(2)}`;
    }
}
