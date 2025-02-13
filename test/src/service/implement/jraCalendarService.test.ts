import 'reflect-metadata';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import { SearchCalendarFilterEntity } from '../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { JraCalendarService } from '../../../../lib/src/service/implement/jraCalendarService';
import {
    baseJraCalendarData,
    baseJraRaceEntity,
} from '../../mock/common/baseJraData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('JraCalendarService', () => {
    let service: JraCalendarService;
    let calendarRepository: ICalendarRepository<JraRaceEntity>;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<JraRaceEntity>();

        container.registerInstance('JraCalendarRepository', calendarRepository);
        service = container.resolve(JraCalendarService);
    });

    it('should fetch events', async () => {
        const startDate = new Date('2023-01-01');
        const finishDate = new Date('2023-01-31');
        const calendarDataList: CalendarData[] = [baseJraCalendarData];

        (calendarRepository.getEvents as jest.Mock).mockResolvedValue(
            calendarDataList,
        );
        const result = await service.getEvents(startDate, finishDate);

        expect(calendarRepository.getEvents).toHaveBeenCalledWith(
            new SearchCalendarFilterEntity(startDate, finishDate),
        );
        expect(result).toEqual(calendarDataList);
    });

    it('should upsert events', async () => {
        const raceEntityList: JraRaceEntity[] = [baseJraRaceEntity];

        await service.upsertEvents(raceEntityList);

        expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
            raceEntityList,
        );
    });

    it('should not upsert events if raceEntityList is empty', async () => {
        const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();

        await service.upsertEvents([]);

        expect(consoleSpy).toHaveBeenCalledWith(
            '更新対象のイベントが見つかりませんでした。',
        );
        expect(calendarRepository.upsertEvents).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('should delete events', async () => {
        const calendarDataList: CalendarData[] = [baseJraCalendarData];

        await service.deleteEvents(calendarDataList);

        expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
            calendarDataList,
        );
    });

    it('should not delete events if calendarDataList is empty', async () => {
        const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();

        await service.deleteEvents([]);

        expect(consoleSpy).toHaveBeenCalledWith(
            '指定された期間にイベントが見つかりませんでした。',
        );
        expect(calendarRepository.deleteEvents).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
