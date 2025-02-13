import 'reflect-metadata';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { FetchCalendarListRequest } from '../../../../lib/src/repository/request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../../../../lib/src/repository/request/upsertCalendarListRequest';
import { FetchCalendarListResponse } from '../../../../lib/src/repository/response/fetchCalendarListResponse';
import { KeirinCalendarService } from '../../../../lib/src/service/implement/keirinCalendarService';
import {
    baseKeirinCalendarData,
    baseKeirinRaceEntity,
} from '../../mock/common/baseKeirinData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('KeirinCalendarService', () => {
    let service: KeirinCalendarService;
    let calendarRepository: ICalendarRepository<KeirinRaceEntity>;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<KeirinRaceEntity>();

        container.registerInstance(
            'KeirinCalendarRepository',
            calendarRepository,
        );
        service = container.resolve(KeirinCalendarService);
    });

    it('should fetch events', async () => {
        const startDate = new Date('2023-01-01');
        const finishDate = new Date('2023-01-31');
        const calendarDataList: CalendarData[] = [baseKeirinCalendarData];
        const response = new FetchCalendarListResponse(calendarDataList);

        (calendarRepository.getEvents as jest.Mock).mockResolvedValue(response);

        const result = await service.getEvents(startDate, finishDate);

        expect(calendarRepository.getEvents).toHaveBeenCalledWith(
            new FetchCalendarListRequest(startDate, finishDate),
        );
        expect(result).toEqual(calendarDataList);
    });

    it('should upsert events', async () => {
        const raceEntityList: KeirinRaceEntity[] = [baseKeirinRaceEntity];

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
        const calendarDataList: CalendarData[] = [baseKeirinCalendarData];

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
