import type { WorldRaceCourse } from '../utility/data/world';

/**
 * 世界の競馬のレース開催場所データ
 */
export class WorldPlaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * 世界の競馬のレース開催場所データを生成する
     * 開催場所の型はWorldRaceCourseを使用しているのでValidationは現時点で不要
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    constructor(
        public readonly dateTime: Date,
        public readonly location: WorldRaceCourse,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<WorldPlaceData> = {}): WorldPlaceData {
        return new WorldPlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
