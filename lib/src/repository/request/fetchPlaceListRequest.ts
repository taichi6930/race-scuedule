/**
 * 競馬場一覧取得リクエスト
 */
export class FetchPlaceListRequest {
    constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
    ) {}
}
