import { format } from 'date-fns';

import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AUTORACE_PLACE_CODE } from '../../utility/data/autorace';
import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
} from '../../utility/data/raceSpecific';

/**
 * Repository層のEntity オートレースのレース開催場所データ
 */
export class AutoracePlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - オートレースのグレード
     */
    constructor(
        id: string | null,
        public readonly dateTime: Date,
        public readonly location: AutoraceRaceCourse,
        public readonly grade: AutoraceGradeType,
    ) {
        this.id = id ?? this.generateId(dateTime, location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoracePlaceEntity> = {}): AutoracePlaceEntity {
        return new AutoracePlaceEntity(
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
    toDomainData(
        partial: Partial<AutoracePlaceEntity> = {},
    ): AutoracePlaceData {
        return new AutoracePlaceData(
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
    private generateId(dateTime: Date, location: AutoraceRaceCourse): string {
        return `autorace${format(dateTime, 'yyyyMMdd')}${AUTORACE_PLACE_CODE[location]}`;
    }
}
