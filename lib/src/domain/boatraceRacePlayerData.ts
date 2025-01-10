import type { BoatracePositionNumber } from '../utility/data/boatrace';

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
        public readonly playerNumber: number,
    ) {
        const [isValid, errorMessageList] = this.validate();
        if (!isValid) {
            throw new Error(errorMessageList.join('\n'));
        }
    }

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

    /**
     * バリデーション
     * 型ではない部分でのバリデーションを行う
     *
     * @returns バリデーション結果
     */
    private validate(): [boolean, string[]] {
        // エラー文をまとめて表示する
        const errorMessageList: string[] = [];

        // 選手番号が1以上であるか
        if (this.playerNumber < 1) {
            errorMessageList.push('選手番号は1以上である必要があります');
        }
        return [errorMessageList.length === 0, errorMessageList];
    }
}
