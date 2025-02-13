import type { CalendarData } from '../../domain/calendarData';
import type { IRaceEntity } from '../entity/iRaceEntity';
import type { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';

/**
 * カレンダーリポジトリインターフェース
 */
export interface ICalendarRepository<R extends IRaceEntity<R>> {
    getEvents: (
        searchFilter: SearchPlaceFilterEntity,
    ) => Promise<CalendarData[]>;

    upsertEvents: (raceEntityList: R[]) => Promise<void>;

    deleteEvents: (calendarDataList: CalendarData[]) => Promise<void>;
}
