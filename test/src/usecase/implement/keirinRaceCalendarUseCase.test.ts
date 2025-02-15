import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { KeirinRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/keirinRaceCalendarUseCase';
import { KeirinSpecifiedGradeList } from '../../../../lib/src/utility/data/keirin/keirinGradeType';
import {
    baseKeirinCalendarData,
    baseKeirinRaceEntity,
} from '../../mock/common/baseKeirinData';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { RaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('KeirinRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<KeirinRaceEntity>>;
    let keirinRaceDataService: jest.Mocked<
        IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let useCase: KeirinRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<KeirinRaceEntity>();
        container.register<ICalendarService<KeirinRaceEntity>>(
            'KeirinCalendarService',
            {
                useValue: calendarServiceMock,
            },
        );

        // KeirinRaceDataServiceをコンテナに登録
        keirinRaceDataService = RaceDataServiceMock<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >();
        container.register<
            IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceDataService', {
            useValue: keirinRaceDataService,
        });

        // KeirinRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(KeirinRaceCalendarUseCase);
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseKeirinCalendarData];

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
                    baseKeirinCalendarData.copy({
                        id: `keirin2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: KeirinRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseKeirinRaceEntity.copy({
                        id: `keirin2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseKeirinCalendarData.copy({
                        id: `keirin2024122920${(i + 6).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: KeirinRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            keirinRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                KeirinSpecifiedGradeList,
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
