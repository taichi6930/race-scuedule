/**
 * カレンダー一覧取得リクエスト
 */
export class FetchCalendarListRequest {
    constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
    ) {}
}
