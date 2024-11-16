import { format } from 'date-fns';

import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinRaceCourse, KeirinGradeType, KEIRIN_PLACE_CODE } from '../../utility/data/keirin';


/**
 * Repository層のEntity 競輪のレース開催場所データ
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
     * 競輪のレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - 競輪のグレード
     */
    constructor(
        id: string | null,
        public readonly dateTime: Date,
        public readonly location: KeirinRaceCourse,
        public readonly grade: KeirinGradeType,
    ) {
        this.id = id ?? this.generateId(dateTime, location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinPlaceEntity> = {}): KeirinPlaceEntity {
        return new KeirinPlaceEntity(
            partial.id ?? null,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }

    /**
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(partial: Partial<KeirinPlaceEntity> = {}): KeirinPlaceData {
        return new KeirinPlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
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
    private generateId(dateTime: Date, location: KeirinRaceCourse): string {
        return `keirin${format(dateTime, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[location]}`;
    }
}
