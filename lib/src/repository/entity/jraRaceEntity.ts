import '../../utility/format';

import { format } from 'date-fns';

import { JraRaceData } from '../../domain/jraRaceData';
import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';
import type {
    JraGradeType,
    JraRaceCourse,
    JraRaceCourseType,
} from '../../utility/data/raceSpecific';

/**
 * 海外競馬のレース開催データ
 */
export class JraRaceEntity {
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
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     */
    constructor(
        id: string | null,
        public readonly name: string,
        public readonly dateTime: Date,
        public readonly location: JraRaceCourse,
        public readonly surfaceType: JraRaceCourseType,
        public readonly distance: number,
        public readonly grade: JraGradeType,
        public readonly number: number,
        public readonly heldTimes: number,
        public readonly heldDayTimes: number,
    ) {
        this.id = id ?? this.generateId(dateTime, location, number);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraRaceEntity> = {}): JraRaceEntity {
        return new JraRaceEntity(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }

    /**
     * ドメインデータに変換する
     * @param partial
     * @returns
     */
    toDomainData(partial: Partial<JraRaceEntity> = {}): JraRaceData {
        return new JraRaceData(
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
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
        location: JraRaceCourse,
        number: number,
    ): string {
        const locationCode = NETKEIBA_BABACODE[location].substring(0, 10);
        return `jra${format(dateTime, 'yyyyMMdd')}${locationCode}${number.toXDigits(2)}`;
    }
}
