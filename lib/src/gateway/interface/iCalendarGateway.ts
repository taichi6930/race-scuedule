import type { calendar_v3 } from 'googleapis';

/**
 * Interface for CalendarGateway
 */
export interface ICalendarGateway {
    /**
     * カレンダーデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchCalendarDataList: (
        startDate: Date,
        finishDate: Date,
    ) => Promise<calendar_v3.Schema$Event[]>;

    /**
     * イベントの削除を行う
     * @param events
     */
    deleteCalendarData: (eventId: string) => Promise<void>;
}
