import { format } from 'date-fns';

import { JraPlaceData } from '../../domain/jraPlaceData';
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
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    constructor(
        id: string | null,
        public readonly dateTime: Date,
        public readonly location: JraRaceCourse,
    ) {
        this.id = id ?? this.generateId(dateTime, location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraPlaceEntity> = {}): JraPlaceEntity {
        return new JraPlaceEntity(
            partial.id ?? null,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }

    /**
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(partial: Partial<JraPlaceEntity> = {}): JraPlaceData {
        return new JraPlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
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
