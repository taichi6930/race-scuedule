import type { CalendarData } from '../../domain/calendarData';

/**
 * カレンダーデータ削除リクエスト
 */
export class DeleteCalendarListRequest {
    constructor(public readonly calendarDataList: CalendarData[]) {}
}
