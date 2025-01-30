import type { CalendarData } from '../../domain/calendarData';

export class DeleteCalendarListRequest {
    constructor(public readonly calendarDataList: CalendarData[]) {}
}
