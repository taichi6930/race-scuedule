import type {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceNumber,
    BoatraceRaceStage,
} from '../utility/data/boatrace';

/**
 * ボートレースのレース開催データ
 */
export class BoatraceRaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催データを生成する
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     */
    constructor(
        public readonly name: string,
        public readonly stage: BoatraceRaceStage,
        public readonly dateTime: Date,
        public readonly location: BoatraceRaceCourse,
        public readonly grade: BoatraceGradeType,
        public readonly number: BoatraceRaceNumber,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<BoatraceRaceData> = {}): BoatraceRaceData {
        return new BoatraceRaceData(
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
