import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import { WorldRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/worldRaceCalendarUseCase';
import type { WorldGradeType } from '../../../../lib/src/utility/data/world';
import { WORLD_SPECIFIED_GRADE_LIST } from '../../../../lib/src/utility/data/world';
import {
    baseWorldRaceData,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';
import { mockWorldRaceRepositoryFromStorageImpl } from '../../mock/repository/worldRaceRepositoryFromStorageImpl';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';

describe('WorldRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<WorldRaceData>>;
    let worldRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    let useCase: WorldRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<WorldRaceData>();
        container.register<ICalendarService<WorldRaceData>>(
            'WorldCalendarService',
            {
                useValue: calendarServiceMock,
            },
        );

        // IRaceRepositoryインターフェースの依存関係を登録
        worldRaceRepositoryFromStorageImpl =
            mockWorldRaceRepositoryFromStorageImpl();
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromStorage',
            {
                useValue: worldRaceRepositoryFromStorageImpl,
            },
        );

        // WorldRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(WorldRaceCalendarUseCase);
    });

    const baseCalendarData = new CalendarData(
        'test20241002',
        '凱旋門賞',
        new Date('2024-10-02T16:30:00Z'),
        new Date('2024-10-02T16:40:00Z'),
        'パリロンシャン競馬場',
        'テスト',
    );

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseCalendarData];

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(mockCalendarData);

            const startDate = new Date('2024-10-01');
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

        it('エラーが発生した場合、空の配列が返ってくること', async () => {
            // モックがエラーをスローするよう設定
            calendarServiceMock.getEvents.mockRejectedValue(
                new Error('Google Calendar API error'),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

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
        it('正常に更新できること', async () => {
            const mockRaceDataList: WorldRaceData[] = [];
            const expectedRaceDataList: WorldRaceData[] = [];
            const mockRaceEntityList: WorldRaceEntity[] = [];
            const expectedRaceEntityList: WorldRaceEntity[] = [];

            const grades: WorldGradeType[] = [
                'GⅠ',
                'Listed',
            ] as WorldGradeType[];
            const months = [12 - 1];
            const days = [29, 30, 31];

            grades.forEach((grade) => {
                months.forEach((month) => {
                    days.forEach((day) => {
                        // モック用のデータを作成
                        mockRaceEntityList.push(
                            baseWorldRaceEntity.copy({
                                raceData: baseWorldRaceData.copy({
                                    name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                    dateTime: new Date(2024, month, day),
                                    grade: grade,
                                }),
                            }),
                        );
                        mockRaceDataList.push(
                            baseWorldRaceEntity.raceData.copy({
                                name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                dateTime: new Date(2024, month, day),
                                grade: grade,
                            }),
                        );
                        if (WORLD_SPECIFIED_GRADE_LIST.includes(grade)) {
                            // 期待するデータを作成
                            expectedRaceEntityList.push(
                                baseWorldRaceEntity.copy({
                                    raceData: baseWorldRaceData.copy({
                                        name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                        dateTime: new Date(2024, month, day),
                                        grade: grade,
                                    }),
                                }),
                            );
                            expectedRaceDataList.push(
                                baseWorldRaceEntity.raceData.copy({
                                    name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                    dateTime: new Date(2024, month, day),
                                    grade: grade,
                                }),
                            );
                        }
                    });
                });
            });

            // モックが値を返すよう設定
            worldRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue({
                raceEntityList: mockRaceEntityList,
            });

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WORLD_SPECIFIED_GRADE_LIST,
            );

            // モックが呼び出されたことを確認
            expect(
                worldRaceRepositoryFromStorageImpl.fetchRaceList,
            ).toHaveBeenCalled();

            // updateEventsが呼び出された回数を確認
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledTimes(1);
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledWith(
                expectedRaceDataList,
            );
        });

        it('fetchRaceListがエラーをスローした場合、エラーメッセージがコンソールに表示されること', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            // fetchRaceListがエラーをスローするようにモック
            worldRaceRepositoryFromStorageImpl.fetchRaceList.mockRejectedValue(
                new Error('Fetch Error'),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WORLD_SPECIFIED_GRADE_LIST,
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
            const mockRaceEntityList: WorldRaceEntity[] = [baseWorldRaceEntity];
            worldRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue({
                raceEntityList: mockRaceEntityList,
            });

            // updateEventsがエラーをスローするようにモック
            calendarServiceMock.upsertEvents.mockRejectedValue(
                new Error('Update Error'),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                WORLD_SPECIFIED_GRADE_LIST,
            );

            // コンソールエラーメッセージが出力されることを確認
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Google Calendar APIへのイベント登録に失敗しました',
                expect.any(Error),
            );

            consoleErrorSpy.mockRestore();
        });
    });

    describe('cleansingRacesFromCalendar', () => {
        it('カレンダーのイベントが正常にクレンジングされること', async () => {
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.cleansingRacesFromCalendar(startDate, finishDate);

            // cleansingEventsが正しく呼び出されたことを確認
            expect(calendarServiceMock.cleansingEvents).toHaveBeenCalledWith(
                startDate,
                finishDate,
            );
        });

        it('クレンジング中にエラーが発生した場合、エラーメッセージがコンソールに表示されること', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            // モックがエラーをスローするよう設定
            calendarServiceMock.cleansingEvents.mockRejectedValue(
                new Error('Cleansing Error'),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.cleansingRacesFromCalendar(startDate, finishDate);

            // コンソールエラーメッセージが出力されることを確認
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Google Calendar APIからのイベントクレンジングに失敗しました',
                expect.any(Error),
            );

            consoleErrorSpy.mockRestore();
        });
    });
});
