import type {
    BoatracePlayerNumber,
    BoatracePositionNumber,
} from '../utility/data/boatrace';

/**
 * ボートレースのレースの選手データ
 */
export class BoatraceRacePlayerData {
    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレースの選手データを生成する
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    constructor(
        public readonly positionNumber: BoatracePositionNumber,
        public readonly playerNumber: BoatracePlayerNumber,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<BoatraceRacePlayerData> = {},
    ): BoatraceRacePlayerData {
        return new BoatraceRacePlayerData(
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
