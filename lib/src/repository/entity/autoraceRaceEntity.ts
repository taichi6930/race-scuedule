import '../../utility/format';

import type { AutoraceRaceData } from '../../domain/autoraceRaceData';
import type { AutoraceRacePlayerData } from '../../domain/autoraceRacePlayerData';
import type { AutoraceRaceId } from '../../utility/raceId';
import { generateAutoraceRaceId } from '../../utility/raceId';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceEntity {
    /**
     * ID
     */
    public readonly id: AutoraceRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param racePlayerDataList - レースの選手データ
     *
     */
    constructor(
        id: AutoraceRaceId | null,
        public readonly raceData: AutoraceRaceData,
        public readonly racePlayerDataList: AutoraceRacePlayerData[],
    ) {
        this.id =
            id ??
            generateAutoraceRaceId(
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
    copy(partial: Partial<AutoraceRaceEntity> = {}): AutoraceRaceEntity {
        return new AutoraceRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
        );
    }

    /**
     * ドメインデータに変換する
     * @returns
     */
    toDomainData = (): AutoraceRaceData => this.raceData;
}
