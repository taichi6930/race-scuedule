import '../../utility/format';

import type { NarRaceData } from '../../domain/narRaceData';
import type { NarRaceId } from '../../utility/raceId';
import { generateNarRaceId } from '../../utility/raceId';

/**
 * 地方競馬のレース開催データ
 */
export class NarRaceEntity {
    /**
     * ID
     */
    public readonly id: NarRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 地方競馬のレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     */
    constructor(
        id: NarRaceId | null,
        public readonly raceData: NarRaceData,
    ) {
        this.id =
            id ??
            generateNarRaceId(
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
    copy(partial: Partial<NarRaceEntity> = {}): NarRaceEntity {
        return new NarRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
        );
    }

    /**
     * ドメインデータに変換する
     * @returns
     */
    toDomainData = (): NarRaceData => this.raceData;
}
