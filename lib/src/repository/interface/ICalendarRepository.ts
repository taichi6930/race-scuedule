import type { CalendarData } from '../../domain/calendarData';
import type { IRaceEntity } from '../entity/iRaceEntity';
import type { SearchFilterEntity } from '../entity/searchFilterEntity';

/**
 * カレンダーリポジトリインターフェース
 */
export interface ICalendarRepository<R extends IRaceEntity<R>> {
    getEvents: (searchFilter: SearchFilterEntity) => Promise<CalendarData[]>;

    upsertEvents: (raceEntityList: R[]) => Promise<void>;

    deleteEvents: (calendarDataList: CalendarData[]) => Promise<void>;
}
