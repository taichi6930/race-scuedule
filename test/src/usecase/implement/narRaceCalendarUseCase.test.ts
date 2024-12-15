import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import { NarRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/narRaceCalendarUseCase';
import { NAR_SPECIFIED_GRADE_LIST } from '../../../../lib/src/utility/data/nar';
import {
    baseNarCalendarData,
    baseNarRaceEntity,
} from '../../mock/common/baseNarData';
import { mockNarRaceRepositoryFromStorageImpl } from '../../mock/repository/narRaceRepositoryFromStorageImpl';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';

describe('NarRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<NarRaceEntity>>;
    let narRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<NarRaceEntity, NarPlaceEntity>
    >;
    let useCase: NarRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<NarRaceEntity>();
        container.register<ICalendarService<NarRaceEntity>>(
            'NarCalendarService',
            {
                useValue: calendarServiceMock,
            },
        );

        // IRaceRepositoryインターフェースの依存関係を登録
        narRaceRepositoryFromStorageImpl =
            mockNarRaceRepositoryFromStorageImpl();
        container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceRepositoryFromStorage',
            {
                useValue: narRaceRepositoryFromStorageImpl,
            },
        );

        // NarRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(NarRaceCalendarUseCase);
    });

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseNarCalendarData];

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

        it('エラーが発生した場合、空の配列が返ってくること', async () => {
            // モックがエラーをスローするよう設定
            calendarServiceMock.getEvents.mockRejectedValue(
                new Error('Google Calendar API error'),
            );

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            const result = await useCase.getRacesFromCalendar(
                startDate,
                finishDate,
            );

            // モックが呼び出されたことを確認
            expect(calendarServiceMock.getEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );
            // モックからエラーが返ってくることを確認
            expect(result).toEqual([]);
        });
    });

    describe('updateRacesToCalendar', () => {
        it('CalendarListがあって、RaceListが空の場合、イベントが削除されること', async () => {
            const mockCalendarDataList: CalendarData[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseNarCalendarData.copy({
                        id: `nar2024122920${i.toXDigits(2)}`,
                    }),
            );
            // RaceEntityListは空
            const mockRaceEntityList: NarRaceEntity[] = [];

            // expectCalendarDataListは空
            const expectCalendarDataList: CalendarData[] = mockCalendarDataList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                NAR_SPECIFIED_GRADE_LIST,
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
            const mockRaceEntityList: NarRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseNarRaceEntity.copy({
                        id: `nar2024122920${i.toXDigits(2)}`,
                    }),
            );

            // expectCalendarDataListは空
            const expectRaceEntityList: NarRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                NAR_SPECIFIED_GRADE_LIST,
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
                    baseNarCalendarData.copy({
                        id: `nar2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: NarRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseNarRaceEntity.copy({
                        id: `nar2024122921${i.toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = mockCalendarDataList;
            const expectRaceEntityList: NarRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                NAR_SPECIFIED_GRADE_LIST,
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
                    baseNarCalendarData.copy({
                        id: `nar2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: NarRaceEntity[] = Array.from(
                { length: 5 },
                (_, i: number) =>
                    baseNarRaceEntity.copy({
                        id: `nar2024122920${i.toXDigits(2)}`,
                    }),
            );

            const expectCalendarDataList: CalendarData[] = Array.from(
                { length: 3 },
                (_, i: number) =>
                    baseNarCalendarData.copy({
                        id: `nar2024122920${(i + 5).toXDigits(2)}`,
                    }),
            );
            const expectRaceEntityList: NarRaceEntity[] = mockRaceEntityList;

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                NAR_SPECIFIED_GRADE_LIST,
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
                    baseNarCalendarData.copy({
                        id: `nar2024122920${i.toXDigits(2)}`,
                    }),
            );
            const mockRaceEntityList: NarRaceEntity[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseNarRaceEntity.copy({
                        id: `nar2024122920${i.toXDigits(2)}`,
                    }),
            );

            const expectRaceEntityList: NarRaceEntity[] = Array.from(
                { length: 8 },
                (_, i: number) =>
                    baseNarRaceEntity.copy({
                        id: `nar2024122920${i.toXDigits(2)}`,
                    }),
            );

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(
                mockCalendarDataList,
            );
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-02-01');
            const finishDate = new Date('2024-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                NAR_SPECIFIED_GRADE_LIST,
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

        it('fetchRaceListがエラーをスローした場合、エラーメッセージがコンソールに表示されること', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            // fetchRaceListがエラーをスローするようにモック
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
                new Error('Fetch Error'),
            );

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                NAR_SPECIFIED_GRADE_LIST,
            );

            // コンソールエラーメッセージが出力されることを確認
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Google Calendar APIへのイベント登録に失敗しました',
                expect.any(Error),
            );

            // エラーがスローされた場合に呼び出されるため、upsertEventsは呼び出されていないことを確認
            consoleErrorSpy.mockRestore();
        });

        it('updateEventsがエラーをスローした場合、エラーメッセージがコンソールに表示されること', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            // fetchRaceListは正常に動作するように設定
            const mockRaceEntityList: NarRaceEntity[] = [baseNarRaceEntity];
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            // updateEventsがエラーをスローするようにモック
            calendarServiceMock.upsertEvents.mockRejectedValue(
                new Error('Update Error'),
            );

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                NAR_SPECIFIED_GRADE_LIST,
            );

            // コンソールエラーメッセージが出力されることを確認
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Google Calendar APIへのイベント登録に失敗しました',
                expect.any(Error),
            );

            consoleErrorSpy.mockRestore();
        });
    });
});
