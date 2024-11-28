import { format } from 'date-fns';

import type { JraPlaceData } from '../../domain/jraPlaceData';
import type { JraRaceCourse } from '../../utility/data/jra';
import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';

/**
 * Repository層のEntity 海外競馬のレース開催場所データ
 */
export class JraPlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催場所データを生成する
     * @param placeData - レース開催場所データ
     */
    constructor(
        id: string | null,
        public readonly placeData: JraPlaceData,
    ) {
        this.id = id ?? this.generateId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraPlaceEntity> = {}): JraPlaceEntity {
        return new JraPlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
        );
    }

    /**
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(): JraPlaceData {
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
    private generateId(dateTime: Date, location: JraRaceCourse): string {
        return `jra${format(dateTime, 'yyyyMMdd')}${NETKEIBA_BABACODE[location]}`;
    }
}
