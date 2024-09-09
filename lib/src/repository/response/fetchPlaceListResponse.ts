/**
 * 競馬場一覧取得レスポンス
 */
export class FetchPlaceListResponse<P> {
    constructor(
        public readonly placeDataList: P[],
    ) { }
}