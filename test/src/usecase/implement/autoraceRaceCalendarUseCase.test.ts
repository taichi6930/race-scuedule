import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import { AutoraceRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/autoraceRaceCalendarUseCase';
import { AUTORACE_SPECIFIED_GRADE_LIST } from '../../../../lib/src/utility/data/autorace/autoraceGradeType';
import {
    baseAutoraceCalendarData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseAutoraceData';
import { mockAutoraceRaceRepositoryFromStorageImpl } from '../../mock/repository/autoraceRaceRepositoryFromStorageImpl';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';

describe('AutoraceRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<AutoraceRaceEntity>>;
    let autoraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let useCase: AutoraceRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<AutoraceRaceEntity>();
        container.register<ICalendarService<AutoraceRaceEntity>>(
            'AutoraceCalendarService',
            {
                useValue: calendarServiceMock,
            },
        );

        // IRaceRepositoryインターフェースの依存関係を登録
        autoraceRaceRepositoryFromStorageImpl =
            mockAutoraceRaceRepositoryFromStorageImpl();
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromStorage', {
            useValue: autoraceRaceRepositoryFromStorageImpl,
        });

        // AutoraceRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(AutoraceRaceCalendarUseCase);
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseAutoraceCalendarData];

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
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${i.toXDigits(2)}`,
                    }),
            );
            // RaceEntityListは空
            const mockRaceEntityList: AutoraceRaceEntity[] = [];

            // expectCalendarDataListは空
            const expectCalendarDataList: CalendarData[] = mockCalendarDataList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                AUTORACE_SPECIFIED_GRADE_LIST,
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
            const mockRaceEntityList: AutoraceRaceEntity[] = [
                ...Array.from({ length: 5 }, (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${i.toXDigits(2)}`,
                    }),
                ),
                baseAutoraceRaceEntity.copy({
                    raceData: baseAutoraceRaceEntity.raceData.copy({
                        grade: '一般',
                    }),
                }),
            ];

            const expectRaceEntityList: AutoraceRaceEntity[] = [
                ...Array.from({ length: 5 }, (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${i.toXDigits(2)}`,
                    }),
                ),
            ];

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                AUTORACE_SPECIFIED_GRADE_LIST,
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
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: AutoraceRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122921${i.toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = mockCalendarDataList;
            const expectRaceEntityList: AutoraceRaceEntity[] =
                mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                AUTORACE_SPECIFIED_GRADE_LIST,
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
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: AutoraceRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${i.toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${(i + 5).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: AutoraceRaceEntity[] =
                mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                AUTORACE_SPECIFIED_GRADE_LIST,
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
                    baseAutoraceCalendarData.copy({
                        id: `autorace2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: AutoraceRaceEntity[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${i.toXDigits(2)}`,
                    }),
            );

            const expectRaceEntityList: AutoraceRaceEntity[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseAutoraceRaceEntity.copy({
                        id: `autorace2024122920${i.toXDigits(2)}`,
                    }),
            );

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                AUTORACE_SPECIFIED_GRADE_LIST,
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
