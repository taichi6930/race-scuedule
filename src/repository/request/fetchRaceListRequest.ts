export class FetchRaceListRequest<P> {
    constructor(
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly placeDataList?: P[],
    ) {
        // startDateがendDateよりも後の日付の場合はエラー
        if (startDate > endDate) {
            throw new Error('startDate must be earlier than endDate');
        }
    }
}
