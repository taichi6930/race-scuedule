import { ICalendarService } from '../../../src/service/interface/ICalendarService';
import { CalendarData } from '../../../src/domain/calendarData';
import { NarRaceData } from '../../../src/domain/narRaceData';
import { JraRaceData } from '../../../src/domain/jraRaceData';

/**
 * CalendarServiceのモックを作成する
 * @returns
 */
export const JraCalendarServiceMock = (): jest.Mocked<ICalendarService<JraRaceData>> => {
    return {
        getEvents: jest.fn().mockResolvedValue([] as CalendarData[]),
        upsertEvents: jest.fn().mockResolvedValue(undefined),
        cleansingEvents: jest.fn().mockResolvedValue(undefined),
    };
}

/**
 * CalendarServiceのモックを作成する
 * @returns
 */
export const NarCalendarServiceMock = (): jest.Mocked<ICalendarService<NarRaceData>> => {
    return {
        getEvents: jest.fn().mockResolvedValue([] as CalendarData[]),
        upsertEvents: jest.fn().mockResolvedValue(undefined),
        cleansingEvents: jest.fn().mockResolvedValue(undefined),
    };
}