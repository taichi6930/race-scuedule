import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import { NarRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/narRaceCalendarUseCase';
import type { NarGradeType } from '../../../../lib/src/utility/data/nar';
import { NAR_SPECIFIED_GRADE_LIST } from '../../../../lib/src/utility/data/nar';
import {
    baseNarCalendarData,
    baseNarRaceData,
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
        it('正常に更新できること', async () => {
            const mockRaceEntityList: NarRaceEntity[] = [];
            const expectedRaceEntityList: NarRaceEntity[] = [];

            const grades: NarGradeType[] = ['GⅠ', 'オープン'] as NarGradeType[];
            const months = [12 - 1];
            const days = [29, 30, 31];

            grades.forEach((grade) => {
                months.forEach((month) => {
                    days.forEach((day) => {
                        // モック用のデータを作成
                        mockRaceEntityList.push(
                            baseNarRaceEntity.copy({
                                raceData: baseNarRaceData.copy({
                                    name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                    dateTime: new Date(2024, month, day),
                                    grade: grade,
                                }),
                            }),
                        );
                        if (NAR_SPECIFIED_GRADE_LIST.includes(grade)) {
                            // 期待するデータを作成
                            expectedRaceEntityList.push(
                                baseNarRaceEntity.copy({
                                    raceData: baseNarRaceData.copy({
                                        name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                        dateTime: new Date(2024, month, day),
                                        grade: grade,
                                    }),
                                }),
                            );
                        }
                    });
                });
            });

            // モックが値を返すよう設定
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2024-01-01');
            const finishDate = new Date('2024-03-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                NAR_SPECIFIED_GRADE_LIST,
            );

            // モックが呼び出されたことを確認
            expect(
                narRaceRepositoryFromStorageImpl.fetchRaceEntityList,
            ).toHaveBeenCalled();

            // updateEventsが呼び出された回数を確認
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledTimes(1);
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledWith(
                expectedRaceEntityList,
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

    describe('cleansingRacesFromCalendar', () => {
        it('カレンダーのイベントが正常にクレンジングされること', async () => {
            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            await useCase.cleansingRacesFromCalendar(startDate, finishDate, []);

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

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            await useCase.cleansingRacesFromCalendar(startDate, finishDate, []);

            // コンソールエラーメッセージが出力されることを確認
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Google Calendar APIからのイベントクレンジングに失敗しました',
                expect.any(Error),
            );

            consoleErrorSpy.mockRestore();
        });
    });
});
