import { format } from 'date-fns';

import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';
import type {
    KeirinGradeType,
    KeirinRaceCourse,
} from '../../utility/data/raceSpecific';

/**
 * Repository層のEntity 競輪のレース開催場所データ
 */
export class KeirinPlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * 開催日時
     */
    public readonly dateTime: Date;

    /**
     * 開催場所
     */
    public readonly location: KeirinRaceCourse;

    /**
     * 競輪のグレード
     */
    public readonly grade: KeirinGradeType;

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
        dateTime: Date,
        location: KeirinRaceCourse,
        grade: KeirinGradeType,
    ) {
        this.id = this.generateId(dateTime, location);
        this.dateTime = dateTime;
        this.location = location;
        this.grade = grade;
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
