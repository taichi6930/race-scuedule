import '../../utility/format';

import type { KeirinPlayerNumber } from '../../utility/data/keirin/keirinPlayerNumber';
import type { KeirinPositionNumber } from '../../utility/data/keirin/keirinPositionNumber';
import type { KeirinRaceId, KeirinRacePlayerId } from '../../utility/raceId';

/**
 * 競輪のレース選手データ
 */
export class KeirinRacePlayerRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     *
     */
    constructor(
        public readonly id: KeirinRacePlayerId,
        public readonly raceId: KeirinRaceId,
        public readonly positionNumber: KeirinPositionNumber,
        public readonly playerNumber: KeirinPlayerNumber,
        public readonly updateDate: Date,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<KeirinRacePlayerRecord> = {},
    ): KeirinRacePlayerRecord {
        return new KeirinRacePlayerRecord(
            partial.id ?? this.id,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
            partial.updateDate ?? this.updateDate,
        );
    }
}
