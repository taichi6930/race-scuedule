import type { CalendarData } from '../../domain/calendarData';
import type { RaceEntity } from '../../repository/entity/baseEntity';

/**
 * CalendarServiceのインターフェース
 * Googleカレンダーなどの操作を行う
 */
export interface ICalendarService<R extends RaceEntity> {
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
     * カレンダーのクレンジングを行う
     * @param startDate
     * @param finishDate
     * @param raceEntityList
     */
    cleansingEvents: (
        startDate: Date,
        finishDate: Date,
        raceEntityList: RaceEntity[],
    ) => Promise<void>;
}
