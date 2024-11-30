import '../../utility/format';

import type { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import type { BoatraceRaceId } from '../../utility/raceId';
import { generateBoatraceRaceId } from '../../utility/raceId';

/**
 * 競輪のレース開催データ
 */
export class BoatraceRaceEntity {
    /**
     * ID
     */
    public readonly id: BoatraceRaceId;

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
        id: BoatraceRaceId | null,
        public readonly raceData: BoatraceRaceData,
        public readonly racePlayerDataList: BoatraceRacePlayerData[],
    ) {
        this.id =
            id ??
            generateBoatraceRaceId(
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
}
