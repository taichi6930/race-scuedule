import '../../utility/format';

import { format } from 'date-fns';

import type { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import type { BoatraceRaceCourse } from '../../utility/data/boatrace';
import { BOATRACE_PLACE_CODE } from '../../utility/data/boatrace';

/**
 * 競輪のレース開催データ
 */
export class BoatraceRaceEntity {
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
     * @param racePlayerDataList - レースの選手データ
     *
     */
    constructor(
        id: string | null,
        public readonly raceData: BoatraceRaceData,
        public readonly racePlayerDataList: BoatraceRacePlayerData[],
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
    copy(partial: Partial<BoatraceRaceEntity> = {}): BoatraceRaceEntity {
        return new BoatraceRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
        );
    }

    /**
     * ドメインデータに変換する
     * @returns
     */
    toDomainData = (): BoatraceRaceData => this.raceData;

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
        location: BoatraceRaceCourse,
        number: number,
    ): string {
        return `boatrace${format(dateTime, 'yyyyMMdd')}${BOATRACE_PLACE_CODE[location]}${number.toXDigits(2)}`;
    }
}
