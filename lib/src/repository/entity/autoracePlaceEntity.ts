import { format } from 'date-fns';

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
