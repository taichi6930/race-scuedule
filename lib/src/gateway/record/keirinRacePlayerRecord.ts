import '../../utility/format';

import {
    type KeirinPlayerNumber,
    validateKeirinPlayerNumber,
} from '../../utility/data/keirin/keirinPlayerNumber';
import {
    type KeirinPositionNumber,
    validateKeirinPositionNumber,
} from '../../utility/data/keirin/keirinPositionNumber';
import {
    type KeirinRaceId,
    type KeirinRacePlayerId,
    validateKeirinRaceId,
    validateKeirinRacePlayerId,
} from '../../utility/raceId';

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
    private constructor(
        public readonly id: KeirinRacePlayerId,
        public readonly raceId: KeirinRaceId,
        public readonly positionNumber: KeirinPositionNumber,
        public readonly playerNumber: KeirinPlayerNumber,
        public readonly updateDate: Date,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     */
    static create(
        id: string,
        raceId: string,
        positionNumber: number,
        playerNumber: number,
        updateDate: Date,
    ): KeirinRacePlayerRecord {
        try {
            return new KeirinRacePlayerRecord(
                validateKeirinRacePlayerId(id),
                validateKeirinRaceId(raceId),
                validateKeirinPositionNumber(positionNumber),
                validateKeirinPlayerNumber(playerNumber),
                updateDate,
            );
        } catch (e) {
            throw new Error(`KeirinRacePlayerRecord: ${(e as Error).message}`);
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<KeirinRacePlayerRecord> = {},
    ): KeirinRacePlayerRecord {
        return KeirinRacePlayerRecord.create(
            partial.id ?? this.id,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
            partial.updateDate ?? this.updateDate,
        );
    }
}
