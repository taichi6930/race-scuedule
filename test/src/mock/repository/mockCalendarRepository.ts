import type { RaceEntity } from '../../../../lib/src/repository/entity/baseEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';

export const mockCalendarRepository = <R extends RaceEntity>(): jest.Mocked<
    ICalendarRepository<R>
> => {
    return {
        getEvents: jest.fn(),
        upsertEvents: jest.fn(),
        deleteEvents: jest.fn(),
    };
};
