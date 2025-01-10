import type {
    AutoracePlayerNumber,
    AutoracePositionNumber,
} from '../utility/data/autorace';

/**
 * オートレースのレースの選手データ
 */
export class AutoraceRacePlayerData {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレースの選手データを生成する
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    constructor(
        public readonly positionNumber: AutoracePositionNumber,
        public readonly playerNumber: AutoracePlayerNumber,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<AutoraceRacePlayerData> = {},
    ): AutoraceRacePlayerData {
        return new AutoraceRacePlayerData(
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
