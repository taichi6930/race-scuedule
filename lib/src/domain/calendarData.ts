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
    private constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly startTime: Date,
        public readonly endTime: Date,
        public readonly location: string,
        public readonly description: string,
    ) {}

    /**
     * インスタンスを生成する
     * @param id
     * @param title
     * @param startTime
     * @param endTime
     * @param location
     * @param description
     * @returns
     */
    static create(
        id: string | null | undefined,
        title: string | null | undefined,
        startTime: Date,
        endTime: Date,
        location: string | null | undefined,
        description: string | null | undefined,
    ): CalendarData {
        return new CalendarData(
            id ?? '',
            title ?? '',
            startTime,
            endTime,
            location ?? '',
            description ?? '',
        );
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<CalendarData> = {}): CalendarData {
        return CalendarData.create(
            partial.id ?? this.id,
            partial.title ?? this.title,
            partial.startTime ?? this.startTime,
            partial.endTime ?? this.endTime,
            partial.location ?? this.location,
            partial.description ?? this.description,
        );
    }
}
