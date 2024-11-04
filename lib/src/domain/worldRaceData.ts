import type {
    WorldGradeType,
    WorldRaceCourse,
    WorldRaceCourseType,
} from '../utility/data/raceSpecific';

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
     */
    constructor(
        public readonly name: string,
        public readonly dateTime: Date,
        public readonly location: WorldRaceCourse,
        public readonly surfaceType: WorldRaceCourseType,
        public readonly distance: number,
        public readonly grade: WorldGradeType,
    ) {
        const [isValid, errorMessageList] = this.validate();
        if (!isValid) {
            throw new Error(errorMessageList.join('\n'));
        }
    }

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
        );
    }

    /**
     * バリデーション
     * 型ではない部分でのバリデーションを行う
     *
     * @returns バリデーション結果
     */
    private validate(): [boolean, string[]] {
        // エラー文をまとめて表示する
        const errorMessageList: string[] = [];

        // 距離は0より大きい
        if (this.distance <= 0) {
            errorMessageList.push('距離は0より大きい必要があります');
        }
        return [errorMessageList.length === 0, errorMessageList];
    }
}
