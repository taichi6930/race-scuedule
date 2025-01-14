import '../../utility/format';

import type { BoatracePlayerNumber } from '../../utility/data/boatrace/boatracePlayerNumber';
import type { BoatracePositionNumber } from '../../utility/data/boatrace/boatracePositionNumber';
import type {
    BoatraceRaceId,
    BoatraceRacePlayerId,
} from '../../utility/raceId';

/**
 * ボートレースのレース選手データ
 */
export class BoatraceRacePlayerRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催データを生成する
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     *
     *
     */
    constructor(
        public readonly id: BoatraceRacePlayerId,
        public readonly raceId: BoatraceRaceId,
        public readonly positionNumber: BoatracePositionNumber,
        public readonly playerNumber: BoatracePlayerNumber,
        public readonly updateDate: Date,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<BoatraceRacePlayerRecord> = {},
    ): BoatraceRacePlayerRecord {
        return new BoatraceRacePlayerRecord(
            partial.id ?? this.id,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
            partial.updateDate ?? this.updateDate,
        );
    }
}
