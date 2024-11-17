import '../../utility/format';

import { format } from 'date-fns';

import type { KeirinRaceData } from '../../domain/keirinRaceData';
import type { KeirinRacePlayerData } from '../../domain/keirinRacePlayerData';
import type { KeirinRaceCourse } from '../../utility/data/keirin';
import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';

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
            this.generateId(
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

    /**
     * IDを生成する
     *
     * @private
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param number - レース番号
     * @returns 生成されたID
     */
    private generateId(
        dateTime: Date,
        location: KeirinRaceCourse,
        number: number,
    ): string {
        return `keirin${format(dateTime, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[location]}${number.toXDigits(2)}`;
    }
}
