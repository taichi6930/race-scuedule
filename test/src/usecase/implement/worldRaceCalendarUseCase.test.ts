import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { WorldRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/worldRaceCalendarUseCase';
import { WorldSpecifiedGradeList } from '../../../../lib/src/utility/data/world/worldGradeType';
import {
    baseWorldCalendarData,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { mockWorldRaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('WorldRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<WorldRaceEntity>>;
    let worldRaceDataService: jest.Mocked<
        IRaceDataService<WorldRaceEntity, WorldPlaceEntity>
    >;
    let useCase: WorldRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<WorldRaceEntity>();
        container.register<ICalendarService<WorldRaceEntity>>(
            'WorldCalendarService',
            {
                useValue: calendarServiceMock,
            },
        );
        worldRaceDataService = mockWorldRaceDataServiceMock();
        container.register<IRaceDataService<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceDataService',
            {
                useValue: worldRaceDataService,
            },
        );

        // WorldRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(WorldRaceCalendarUseCase);
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseWorldCalendarData];

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
        it('CalendarListがあって、RaceListが空の場合、イベントが削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseWorldCalendarData.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );
            // RaceEntityListは空
            const mockRaceEntityList: WorldRaceEntity[] = [];

            // expectCalendarDataListは空
            const expectCalendarDataList: CalendarData[] = mockCalendarDataList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            worldRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WorldSpecifiedGradeList,
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
            // RaceEntityListは空
            const mockRaceEntityList: WorldRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseWorldRaceEntity.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );

            // expectCalendarDataListは空
            const expectRaceEntityList: WorldRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            worldRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WorldSpecifiedGradeList,
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
                    baseWorldCalendarData.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: WorldRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseWorldRaceEntity.copy({
                        id: `world2024122921${i.toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = mockCalendarDataList;
            const expectRaceEntityList: WorldRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            worldRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WorldSpecifiedGradeList,
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
                    baseWorldCalendarData.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: WorldRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseWorldRaceEntity.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseWorldCalendarData.copy({
                        id: `world2024122920${(i + 5).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: WorldRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            worldRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WorldSpecifiedGradeList,
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
                    baseWorldCalendarData.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: WorldRaceEntity[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseWorldRaceEntity.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );

            const expectRaceEntityList: WorldRaceEntity[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseWorldRaceEntity.copy({
                        id: `world2024122920${i.toXDigits(2)}`,
                    }),
            );

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            worldRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntityList,
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WorldSpecifiedGradeList,
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
