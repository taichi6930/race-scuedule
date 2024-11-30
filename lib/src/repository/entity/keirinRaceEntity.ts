import '../../utility/format';

import type { KeirinRaceData } from '../../domain/keirinRaceData';
import type { KeirinRacePlayerData } from '../../domain/keirinRacePlayerData';
import { generateKeirinRaceId } from '../../utility/raceId';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceEntity {
    /**
     * ID
     */
    public readonly id: string;

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
        id: string | null,
        public readonly raceData: KeirinRaceData,
        public readonly racePlayerDataList: KeirinRacePlayerData[],
    ) {
        this.id =
            id ??
            generateKeirinRaceId(
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
    copy(partial: Partial<KeirinRaceEntity> = {}): KeirinRaceEntity {
        return new KeirinRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
        );
    }

    /**
     * ドメインデータに変換する
     * @returns
     */
    toDomainData = (): KeirinRaceData => this.raceData;
}
