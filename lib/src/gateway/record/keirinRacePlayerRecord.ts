import '../../utility/format';

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
     *
     *
     */
    constructor(
        public readonly id: string,
        public readonly raceId: string,
        public readonly positionNumber: number,
        public readonly playerNumber: number,
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
        );
    }
}
