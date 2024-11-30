import '../../utility/format';

import type { JraRaceData } from '../../domain/jraRaceData';
import type { JraRaceId } from '../../utility/raceId';
import { generateJraRaceId } from '../../utility/raceId';

/**
 * 中央競馬のレース開催データ
 */
export class JraRaceEntity {
    /**
     * ID
     */
    public readonly id: JraRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 中央競馬のレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     */
    constructor(
        id: JraRaceId | null,
        public readonly raceData: JraRaceData,
    ) {
        this.id =
            id ??
            generateJraRaceId(
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
    copy(partial: Partial<JraRaceEntity> = {}): JraRaceEntity {
        return new JraRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
        );
    }

    /**
     * ドメインデータに変換する
     * @returns
     */
    toDomainData = (): JraRaceData => this.raceData;
}
