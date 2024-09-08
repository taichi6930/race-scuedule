/**
 * レース一覧取得レスポンス
 */
export class FetchRaceListResponse<R> {
    constructor(
        public readonly raceDataList: R[],
    ) { }
}