import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { BoatraceRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/boatraceRaceCalendarUseCase';
import { BoatraceSpecifiedGradeList } from '../../../../lib/src/utility/data/boatrace/boatraceGradeType';
import {
    baseBoatraceCalendarData,
    baseBoatraceRaceEntity,
} from '../../mock/common/baseBoatraceData';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { mockBoatraceRaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('BoatraceRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<BoatraceRaceEntity>>;
    let boatraceRaceDataService: jest.Mocked<
        IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let useCase: BoatraceRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<BoatraceRaceEntity>();
        container.register<ICalendarService<BoatraceRaceEntity>>(
            'BoatraceCalendarService',
            {
                useValue: calendarServiceMock,
            },
        );

        // IRaceRepositoryインターフェースの依存関係を登録
        boatraceRaceDataService = mockBoatraceRaceDataServiceMock();
        container.register<
            IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceDataService', {
            useValue: boatraceRaceDataService,
        });

        // BoatraceRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(BoatraceRaceCalendarUseCase);
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseBoatraceCalendarData];

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(mockCalendarData);

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

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
        it('CalendarListがあって、RaceListが空の場合、イベントが削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseBoatraceCalendarData.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            // RaceEntityListは空
            const mockRaceEntityList: BoatraceRaceEntity[] = [];

            // expectCalendarDataListは空
            const expectCalendarDataList: CalendarData[] = mockCalendarDataList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                BoatraceSpecifiedGradeList,
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
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledTimes(0);
        });

        it('CalendarListが空で、RaceListのみある場合、イベントが追加されること', async () => {
            const mockCalendarDataList: CalendarData[] = [];
            const mockRaceEntityList: BoatraceRaceEntity[] = [
                ...Array.from({ length: 5 }, (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
                ),
                baseBoatraceRaceEntity.copy({
                    raceData: baseBoatraceRaceEntity.raceData.copy({
                        grade: '一般',
                    }),
                }),
            ];

            const expectRaceEntityList: BoatraceRaceEntity[] = [
                ...Array.from({ length: 5 }, (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
                ),
            ];
            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                BoatraceSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarServiceMock.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );

            expect(calendarServiceMock.deleteEvents).toHaveBeenCalledTimes(0);
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledTimes(1);
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledWith(
                expectRaceEntityList,
            );
        });

        it('CalendarList、RaceListもあり、IDが被らない場合、イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseBoatraceCalendarData.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: BoatraceRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122921${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = mockCalendarDataList;
            const expectRaceEntityList: BoatraceRaceEntity[] =
                mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                BoatraceSpecifiedGradeList,
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

        it('CalendarList、RaceListもあり、IDが複数被る場合、イベントが追加・削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseBoatraceCalendarData.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: BoatraceRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseBoatraceCalendarData.copy({
                        id: `boatrace2024122920${(i + 6).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: BoatraceRaceEntity[] =
                mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                BoatraceSpecifiedGradeList,
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

        it('CalendarList、RaceListもあり、IDが複数被る場合、イベントが追加のみされること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseBoatraceCalendarData.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: BoatraceRaceEntity[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            const expectRaceEntityList: BoatraceRaceEntity[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseBoatraceRaceEntity.copy({
                        id: `boatrace2024122920${(i + 1).toXDigits(2)}`,
                    }),
            );

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                BoatraceSpecifiedGradeList,
            );

            // モックが呼び出されたことを確認
            expect(calendarServiceMock.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );

            // deleteEventsが呼び出された回数を確認
            expect(calendarServiceMock.deleteEvents).toHaveBeenCalledTimes(0);
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledTimes(1);
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledWith(
                expectRaceEntityList,
            );
        });
    });
});
