import { NarRaceCourse, NarRaceCourseType, NarGradeType } from '../utility/raceSpecificData';

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
        public readonly name: string, // レース名
        public readonly dateTime: Date, // 開催日時
        public readonly location: NarRaceCourse, // 競馬場名
        public readonly surfaceType: NarRaceCourseType, // 馬場種別
        public readonly distance: number, // 距離
        public readonly grade: NarGradeType, // グレード
        public readonly number: number, // レース番号
    ) {
        const [isValid, errorMessageList] = this.validate();
        if (!isValid) {
            throw new Error(errorMessageList.join("\n"));
        }
    }

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
            partial.number ?? this.number
        );
    };

    /**
     * バリデーション
     * 型ではない部分でのバリデーションを行う
     *
     * @returns バリデーション結果
     */
    private validate(): [boolean, string[]] {
        // エラー文をまとめて表示する
        let errorMessageList: string[] = [];

        // 距離は0より大きい
        if (this.distance <= 0) {
            errorMessageList.push("距離は0より大きい必要があります");
        }
        // レース番号は1以上12以下
        if (this.number < 1 || this.number > 12) {
            errorMessageList.push("レース番号は1以上12以下である必要があります");
        }
        return [errorMessageList.length === 0, errorMessageList];
    }
}
