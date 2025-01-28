import type { CalendarData } from '../../domain/calendarData';

export class FetchCalendarListResponse {
    constructor(public readonly calendarDataList: CalendarData[]) {}
}
