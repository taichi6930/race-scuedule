import 'reflect-metadata';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { DeleteCalendarListRequest } from '../../../../lib/src/repository/request/deleteCalendarListRequest';
import { FetchCalendarListRequest } from '../../../../lib/src/repository/request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../../../../lib/src/repository/request/upsertCalendarListRequest';
import { FetchCalendarListResponse } from '../../../../lib/src/repository/response/fetchCalendarListResponse';
import { WorldCalendarService } from '../../../../lib/src/service/implement/worldCalendarService';
import {
    baseWorldCalendarData,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('WorldCalendarService', () => {
    let service: WorldCalendarService;
    let calendarRepository: ICalendarRepository<WorldRaceEntity>;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<WorldRaceEntity>();

        container.registerInstance(
            'WorldCalendarRepository',
            calendarRepository,
        );
        service = container.resolve(WorldCalendarService);
    });

    it('should fetch events', async () => {
        const startDate = new Date('2023-01-01');
        const finishDate = new Date('2023-01-31');
        const calendarDataList: CalendarData[] = [baseWorldCalendarData];
        const response = new FetchCalendarListResponse(calendarDataList);

        (calendarRepository.getEvents as jest.Mock).mockResolvedValue(response);

        const result = await service.getEvents(startDate, finishDate);

        expect(calendarRepository.getEvents).toHaveBeenCalledWith(
            new FetchCalendarListRequest(startDate, finishDate),
        );
        expect(result).toEqual(calendarDataList);
    });

    it('should upsert events', async () => {
        const raceEntityList: WorldRaceEntity[] = [baseWorldRaceEntity];

        await service.upsertEvents(raceEntityList);

        expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
            new UpsertCalendarListRequest(raceEntityList),
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
        const calendarDataList: CalendarData[] = [baseWorldCalendarData];

        await service.deleteEvents(calendarDataList);

        expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
            new DeleteCalendarListRequest(calendarDataList),
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
