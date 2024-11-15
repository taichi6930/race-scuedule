import { format } from 'date-fns';

import type { BoatracePlaceData } from '../../domain/boatracePlaceData';
import type { BoatraceRaceCourse } from '../../utility/data/boatrace';
import { BOATRACE_PLACE_CODE } from '../../utility/data/boatrace';

/**
 * Repository層のEntity ボートレースのレース開催場所データ
 */
export class BoatracePlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - ボートレースのグレード
     */
    constructor(
        id: string | null,
        public readonly placeData: BoatracePlaceData,
    ) {
        this.id = id ?? this.generateId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<BoatracePlaceEntity> = {}): BoatracePlaceEntity {
        return new BoatracePlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
        );
    }

    /**
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(): BoatracePlaceData {
        return this.placeData;
    }

    /**
     * IDを生成する
     *
     * @private
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @returns 生成されたID
     */
    private generateId(dateTime: Date, location: BoatraceRaceCourse): string {
        return `boatrace${format(dateTime, 'yyyyMMdd')}${BOATRACE_PLACE_CODE[location]}`;
    }
}
