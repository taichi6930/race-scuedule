export class FetchCalendarListRequest {
    constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
    ) {}
}
