import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceNumber,
    AutoraceRaceStage,
} from '../utility/data/autorace';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     */
    constructor(
        public readonly name: string,
        public readonly stage: AutoraceRaceStage,
        public readonly dateTime: Date,
        public readonly location: AutoraceRaceCourse,
        public readonly grade: AutoraceGradeType,
        public readonly number: AutoraceRaceNumber,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoraceRaceData> = {}): AutoraceRaceData {
        return new AutoraceRaceData(
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
