/**
 * 競馬場一覧取得リクエスト
 */
export class FetchPlaceListRequest {
    constructor(
        public readonly startDate: Date,
        public readonly endDate: Date,
    ) {
        // startDateがendDateよりも後の日付の場合はエラー
        if (startDate > endDate) {
            throw new Error('startDate must be earlier than endDate');
        }
    }
}
