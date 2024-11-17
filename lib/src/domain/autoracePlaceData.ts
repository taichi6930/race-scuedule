import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
} from '../utility/data/autorace';

/**
 * オートレースのレース開催場所データ
 */
export class AutoracePlaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催場所データを生成する
     * 開催場所の型はAutoraceRaceCourseを使用しているのでValidationは現時点で不要
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - オートレースのグレード
     */
    constructor(
        public readonly dateTime: Date,
        public readonly location: AutoraceRaceCourse,
        public readonly grade: AutoraceGradeType,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoracePlaceData> = {}): AutoracePlaceData {
        return new AutoracePlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
