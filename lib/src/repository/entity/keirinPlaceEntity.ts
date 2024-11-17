import { format } from 'date-fns';

import type { KeirinPlaceData } from '../../domain/keirinPlaceData';
import type { KeirinRaceCourse } from '../../utility/data/keirin';
import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';

/**
 * Repository層のEntity ボートレースのレース開催場所データ
 */
export class KeirinPlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     */
    constructor(
        id: string | null,
        public readonly placeData: KeirinPlaceData,
    ) {
        this.id = id ?? this.generateId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinPlaceEntity> = {}): KeirinPlaceEntity {
        return new KeirinPlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
        );
    }

    /**
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(): KeirinPlaceData {
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
    private generateId(dateTime: Date, location: KeirinRaceCourse): string {
        return `keirin${format(dateTime, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[location]}`;
    }
}
