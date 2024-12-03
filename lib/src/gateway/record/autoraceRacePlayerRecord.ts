import '../../utility/format';

import type { AutoraceRaceId } from '../../utility/raceId';

/**
 * オートレースのレース選手データ
 */
export class AutoraceRacePlayerRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     *
     *
     */
    constructor(
        public readonly id: string,
        public readonly raceId: AutoraceRaceId,
        public readonly positionNumber: number,
        public readonly playerNumber: number,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<AutoraceRacePlayerRecord> = {},
    ): AutoraceRacePlayerRecord {
        return new AutoraceRacePlayerRecord(
            partial.id ?? this.id,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
