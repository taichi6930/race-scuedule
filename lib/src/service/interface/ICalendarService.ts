import type { CalendarData } from '../../domain/calendarData';
import type { IRaceEntity } from '../../repository/entity/iRaceEntity';

/**
 * CalendarServiceのインターフェース
 * Googleカレンダーなどの操作を行う
 */
export interface ICalendarService<R extends IRaceEntity<R>> {
    /**
     * カレンダーのイベントの取得を行う
     * @param startDate
     * @param finishDate
     */
    getEvents: (startDate: Date, finishDate: Date) => Promise<CalendarData[]>;
    /**
     * カレンダーのイベントの更新を行う
     * @param raceEntityList
     */
    upsertEvents: (raceEntityList: R[]) => Promise<void>;
    /**
     * カレンダーのイベントの削除を行う
     * @param calendarDataList
     */
    deleteEvents: (calendarDataList: CalendarData[]) => Promise<void>;
}
