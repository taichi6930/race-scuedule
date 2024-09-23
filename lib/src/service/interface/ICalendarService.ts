import type { CalendarData } from '../../domain/calendarData';

/**
 * CalendarServiceのインターフェース
 * Googleカレンダーなどの操作を行う
 */
export interface ICalendarService<R> {
    /**
     * カレンダーのイベントの取得を行う
     * @param startDate
     * @param finishDate
     */
    getEvents: (startDate: Date, finishDate: Date) => Promise<CalendarData[]>;
    /**
     * カレンダーのイベントの更新を行う
     * @param raceList
     */
    upsertEvents: (raceList: R[]) => Promise<void>;
    /**
     * カレンダーのクレンジングを行う
     * @param startDate
     * @param finishDate
     */
    cleansingEvents: (startDate: Date, finishDate: Date) => Promise<void>;
}
