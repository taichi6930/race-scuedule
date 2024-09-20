/**
 * レース一覧取得リクエスト
 */
export class FetchRaceListRequest<P> {
    constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly placeDataList?: P[],
    ) {}
}
