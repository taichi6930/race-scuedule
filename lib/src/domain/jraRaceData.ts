import type {
    JraGradeType,
    JraRaceCourse,
    JraRaceCourseType,
    JraRaceDistance,
    JraRaceNumber,
} from '../utility/data/jra';

/**
 * JRAのレース開催データ
 */
export class JraRaceData {
    /**
     * コンストラクタ
     *
     * @remarks
     * JRAのレース開催データを生成する
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     */
    constructor(
        public readonly name: string,
        public readonly dateTime: Date,
        public readonly location: JraRaceCourse,
        public readonly surfaceType: JraRaceCourseType,
        public readonly distance: JraRaceDistance,
        public readonly grade: JraGradeType,
        public readonly number: JraRaceNumber,
        public readonly heldTimes: number,
        public readonly heldDayTimes: number,
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
    copy(partial: Partial<JraRaceData> = {}): JraRaceData {
        return new JraRaceData(
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
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
        // 開催回数は1以上
        if (this.heldTimes < 1) {
            errorMessageList.push('開催回数は1以上である必要があります');
        }
        // 開催日数は1以上
        if (this.heldDayTimes < 1) {
            errorMessageList.push('開催日数は1以上である必要があります');
        }
        return [errorMessageList.length === 0, errorMessageList];
    }
}
