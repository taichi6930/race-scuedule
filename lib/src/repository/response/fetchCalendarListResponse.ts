import type { CalendarData } from '../../domain/calendarData';

/**
 * カレンダーデータ取得リクエスト
 */
export class FetchCalendarListResponse {
    constructor(public readonly calendarDataList: CalendarData[]) {}
}
