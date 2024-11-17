import '../../utility/format';

import { format } from 'date-fns';

import { NarRaceData } from '../../domain/narRaceData';
import type {
    NarGradeType,
    NarRaceCourse,
    NarRaceCourseType,
} from '../../utility/data/nar';
import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';

/**
 * 地方競馬のレース開催データ
 */
export class NarRaceEntity {
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
        public readonly location: NarRaceCourse,
        public readonly surfaceType: NarRaceCourseType,
        public readonly distance: number,
        public readonly grade: NarGradeType,
        public readonly number: number,
    ) {
        this.id = id ?? this.generateId(dateTime, location, number);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarRaceEntity> = {}): NarRaceEntity {
        return new NarRaceEntity(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }

    /**
     * ドメインデータに変換する
     * @param partial
     * @returns
     */
    toDomainData(partial: Partial<NarRaceEntity> = {}): NarRaceData {
        return new NarRaceData(
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
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
        location: NarRaceCourse,
        number: number,
    ): string {
        const locationCode = NETKEIBA_BABACODE[location].substring(0, 10);
        return `nar${format(dateTime, 'yyyyMMdd')}${locationCode}${number.toXDigits(2)}`;
    }
}
