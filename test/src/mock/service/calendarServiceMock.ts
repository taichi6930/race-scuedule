import type { RaceData } from '../../../../lib/src/domain/baseData';
import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';

/**
 * CalendarServiceのモックを作成する
 * @returns
 */
export const CalendarServiceMock = <R extends RaceData>(): jest.Mocked<
    ICalendarService<R>
> => {
    return {
        getEvents: jest.fn().mockResolvedValue([] as CalendarData[]),
        upsertEvents: jest.fn().mockResolvedValue(undefined),
        cleansingEvents: jest.fn().mockResolvedValue(undefined),
    };
};
