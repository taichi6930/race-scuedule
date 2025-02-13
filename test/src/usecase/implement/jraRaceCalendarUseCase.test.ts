import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { JraRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/jraRaceCalendarUseCase';
import { JraSpecifiedGradeList } from '../../../../lib/src/utility/data/jra/jraGradeType';
import {
    baseJraCalendarData,
    baseJraRaceEntity,
} from '../../mock/common/baseJraData';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { mockJraRaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('JraRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<JraRaceEntity>>;
    let jraRaceDataService: jest.Mocked<
        IRaceDataService<JraRaceEntity, JraPlaceEntity>
    >;
    let useCase: JraRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<JraRaceEntity>();
        container.register<ICalendarService<JraRaceEntity>>(
            'JraCalendarService',
            {
                useValue: calendarServiceMock,
            },
        );

        // JraRaceDataServiceをコンテナに登録
        jraRaceDataService = mockJraRaceDataServiceMock();
        container.register<IRaceDataService<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceDataService',
            {
                useValue: jraRaceDataService,
            },
        );

        // JraRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(JraRaceCalendarUseCase);
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseJraCalendarData];

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(mockCalendarData);

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            const result = await useCase.getRacesFromCalendar(
                startDate,
                finishDate,
            );

            expect(calendarServiceMock.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );
            expect(result).toEqual(mockCalendarData);
        });
    });

    describe('updateRacesToCalendar', () => {
        it('CalendarList、RaceListもあり、IDが複数被る場合、イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseJraCalendarData.copy({
                        id: `jra2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: JraRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseJraRaceEntity.copy({
                        id: `jra2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseJraCalendarData.copy({
                        id: `jra2024122920${(i + 6).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: JraRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            jraRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                JraSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarServiceMock.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );

            // deleteEventsが呼び出された回数を確認
            expect(calendarServiceMock.deleteEvents).toHaveBeenCalledTimes(1);
            expect(calendarServiceMock.deleteEvents).toHaveBeenCalledWith(
                expectCalendarDataList,
            );
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledTimes(1);
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledWith(
                expectRaceEntityList,
            );
        });
    });
});
