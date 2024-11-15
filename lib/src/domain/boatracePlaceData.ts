import type {
    BoatraceGradeType,
    BoatraceRaceCourse,
} from '../utility/data/boatrace';

/**
 * ボートレースのレース開催場所データ
 */
export class BoatracePlaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催場所データを生成する
     * 開催場所の型はBoatraceRaceCourseを使用しているのでValidationは現時点で不要
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - ボートレースのグレード
     */
    constructor(
        public readonly dateTime: Date,
        public readonly location: BoatraceRaceCourse,
        public readonly grade: BoatraceGradeType,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<BoatracePlaceData> = {}): BoatracePlaceData {
        return new BoatracePlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
