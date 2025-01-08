import type {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceNumber,
    KeirinRaceStage,
} from '../utility/data/keirin';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     */
    constructor(
        public readonly name: string,
        public readonly stage: KeirinRaceStage,
        public readonly dateTime: Date,
        public readonly location: KeirinRaceCourse,
        public readonly grade: KeirinGradeType,
        public readonly number: KeirinRaceNumber,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinRaceData> = {}): KeirinRaceData {
        return new KeirinRaceData(
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
