import { CalendarData } from '../../domain/calendarData';

/**
 * CalendarServiceのインターフェース
 * Googleカレンダーなどの操作を行う
 */
export interface ICalendarService<R> {
    /**
     * カレンダーのイベントの取得を行う
     * @param startDate
     * @param endDate
     */
    getEvents(startDate: Date, endDate: Date): Promise<CalendarData[]>;
    /**
     * カレンダーのイベントの更新を行う
     * @param raceList
     */
    upsertEvents(raceList: R[]): Promise<void>;
    /**
     * カレンダーのクレンジングを行う
     * @param startDate
     * @param endDate
     */
    cleansingEvents(startDate: Date, endDate: Date): Promise<void>;
}