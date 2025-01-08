import type {
    WorldGradeType,
    WorldRaceCourse,
    WorldRaceCourseType,
    WorldRaceDistance,
    WorldRaceNumber,
} from '../utility/data/world';

/**
 * 世界の競馬のレース開催データ
 */
export class WorldRaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * 世界の競馬のレース開催データを生成する
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
        public readonly location: WorldRaceCourse,
        public readonly surfaceType: WorldRaceCourseType,
        public readonly distance: WorldRaceDistance,
        public readonly grade: WorldGradeType,
        public readonly number: WorldRaceNumber,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<WorldRaceData> = {}): WorldRaceData {
        return new WorldRaceData(
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
