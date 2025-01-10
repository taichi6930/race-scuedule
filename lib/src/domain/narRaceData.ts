import type {
    NarGradeType,
    NarRaceCourse,
    NarRaceCourseType,
    NarRaceDistance,
    NarRaceNumber,
} from '../utility/data/nar';

/**
 * NARのレース開催データ
 */
export class NarRaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * NARのレース開催データを生成する
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     */
    constructor(
        public readonly name: string,
        public readonly dateTime: Date,
        public readonly location: NarRaceCourse,
        public readonly surfaceType: NarRaceCourseType,
        public readonly distance: NarRaceDistance,
        public readonly grade: NarGradeType,
        public readonly number: NarRaceNumber,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarRaceData> = {}): NarRaceData {
        return new NarRaceData(
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
