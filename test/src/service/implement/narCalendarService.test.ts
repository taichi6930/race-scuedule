import 'reflect-metadata';

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import { SearchCalendarFilterEntity } from '../../../../lib/src/repository/entity/searchCalendarFilterEntity';
import type { ICalendarRepository } from '../../../../lib/src/repository/interface/ICalendarRepository';
import { NarCalendarService } from '../../../../lib/src/service/implement/narCalendarService';
import {
    baseNarCalendarData,
    baseNarRaceEntity,
} from '../../mock/common/baseNarData';
import { mockCalendarRepository } from '../../mock/repository/mockCalendarRepository';

describe('NarCalendarService', () => {
    let service: NarCalendarService;
    let calendarRepository: jest.Mocked<ICalendarRepository<NarRaceEntity>>;

    beforeEach(() => {
        calendarRepository = mockCalendarRepository<NarRaceEntity>();
        container.registerInstance('NarCalendarRepository', calendarRepository);
        service = container.resolve(NarCalendarService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getEvents', () => {
        it('カレンダーのイベントの取得が正常に行われること', async () => {
            const startDate = new Date('2023-01-01');
            const finishDate = new Date('2023-01-31');
            const calendarDataList: CalendarData[] = [baseNarCalendarData];

            calendarRepository.getEvents.mockResolvedValue(calendarDataList);
            const result = await service.getEvents(startDate, finishDate);

            expect(calendarRepository.getEvents).toHaveBeenCalledWith(
                new SearchCalendarFilterEntity(startDate, finishDate),
            );
            expect(result).toEqual(calendarDataList);
        });
    });

    describe('upsertEvents', () => {
        it('カレンダーのイベントの更新が正常に行われること', async () => {
            const raceEntityList: NarRaceEntity[] = [baseNarRaceEntity];

            await service.upsertEvents(raceEntityList);

            expect(calendarRepository.upsertEvents).toHaveBeenCalledWith(
                raceEntityList,
            );
        });

        it('更新対象のイベントが見つからない場合、更新処理が行われないこと', async () => {
            const consoleSpy = jest
                .spyOn(console, 'debug')
                .mockImplementation();

            await service.upsertEvents([]);

            expect(consoleSpy).toHaveBeenCalledWith(
                '更新対象のイベントが見つかりませんでした。',
            );
            expect(calendarRepository.upsertEvents).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('deleteEvents', () => {
        it('カレンダーのイベントの削除が正常に行われること', async () => {
            const calendarDataList: CalendarData[] = [baseNarCalendarData];

            await service.deleteEvents(calendarDataList);

            expect(calendarRepository.deleteEvents).toHaveBeenCalledWith(
                calendarDataList,
            );
        });

        it('削除対象のイベントが見つからない場合、削除処理が行われないこと', async () => {
            const consoleSpy = jest
                .spyOn(console, 'debug')
                .mockImplementation();

            await service.deleteEvents([]);

            expect(consoleSpy).toHaveBeenCalledWith(
                '指定された期間にイベントが見つかりませんでした。',
            );
            expect(calendarRepository.deleteEvents).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });
});
