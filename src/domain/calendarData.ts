/**
 * カレンダーのデータを表すクラス
 */
export class CalendarData {
    /**
     * コンストラクタ
     *
     * @remarks
     * カレンダーのデータを生成する
     * @param id - イベントID
     * @param title - イベントタイトル
     * @param startTime - イベント開始時間
     * @param endTime - イベント終了時間
     * @param location - イベント場所
     * @param description - イベント説明
     */
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly startTime: Date,
        public readonly endTime: Date,
        public readonly location: string,
        public readonly description: string,
    ) { }
}
