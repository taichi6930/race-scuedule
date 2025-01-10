import type {
    KeirinPlayerNumber,
    KeirinPositionNumber,
} from '../utility/data/keirin';

/**
 * 競輪のレースの選手データ
 */
export class KeirinRacePlayerData {
    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレースの選手データを生成する
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    constructor(
        public readonly positionNumber: KeirinPositionNumber,
        public readonly playerNumber: KeirinPlayerNumber,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinRacePlayerData> = {}): KeirinRacePlayerData {
        return new KeirinRacePlayerData(
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
