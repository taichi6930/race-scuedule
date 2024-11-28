import '../../utility/format';

import { format } from 'date-fns';

import type { JraRaceData } from '../../domain/jraRaceData';
import type { JraRaceCourse } from '../../utility/data/jra';
import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';

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
     * @param raceData - レースデータ
     */
    constructor(
        id: string | null,
        public readonly raceData: JraRaceData,
    ) {
        this.id =
            id ??
            this.generateId(
                raceData.dateTime,
                raceData.location,
                raceData.number,
            );
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraRaceEntity> = {}): JraRaceEntity {
        return new JraRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
        );
    }

    /**
     * ドメインデータに変換する
     * @param partial
     * @returns
     */
    toDomainData(): JraRaceData {
        return this.raceData;
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
