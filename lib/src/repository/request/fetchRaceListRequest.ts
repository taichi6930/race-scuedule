/**
 * レース一覧取得リクエスト
 */
export class FetchRaceListRequest<P> {
    constructor(
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly placeDataList?: P[],
    ) {}
}
