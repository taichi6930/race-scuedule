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
     * カレンダーデータを取得する
     * @param eventId
     */
    fetchCalendarData: (eventId: string) => Promise<calendar_v3.Schema$Event>;

    /**
     * カレンダーデータの更新を行う
     * @param calendarData
     */
    updateCalendarData: (
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;

    /**
     * イベントの追加を行う
     * @param calendarData
     */
    insertCalendarData: (
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;

    /**
     * イベントの削除を行う
     * @param events
     */
    deleteCalendarData: (eventId: string) => Promise<void>;
}
