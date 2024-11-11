import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import { AutoraceRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/autoraceRaceCalendarUseCase';
import type { AutoraceGradeType } from '../../../../lib/src/utility/data/raceSpecific';
import { AUTORACE_SPECIFIED_GRADE_LIST } from '../../../../lib/src/utility/data/raceSpecific';
import {
    baseAutoraceCalendarData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseData';
import { mockAutoraceRaceRepositoryFromStorageImpl } from '../../mock/repository/autoraceRaceRepositoryFromStorageImpl';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';

describe('AutoraceRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<AutoraceRaceData>>;
    let autoraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let useCase: AutoraceRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<AutoraceRaceData>();
        container.register<ICalendarService<AutoraceRaceData>>(
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

    const baseCalendarData = baseAutoraceCalendarData;

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseCalendarData];

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(mockCalendarData);

            const startDate = new Date('2024-12-01');
            const finishDate = new Date('2024-12-31');

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
        const baseAutoraceCalendarEntity = baseAutoraceRaceEntity;

        it('正常に更新できること', async () => {
            const mockRaceDataList: AutoraceRaceData[] = [];
            const expectedRaceDataList: AutoraceRaceData[] = [];
            const mockRaceEntityList: AutoraceRaceEntity[] = [];
            const expectedRaceEntityList: AutoraceRaceEntity[] = [];

            const grades: AutoraceGradeType[] = ['SG'] as AutoraceGradeType[];
            const months = [12 - 1];
            const days = [29, 30, 31];

            grades.forEach((grade) => {
                months.forEach((month) => {
                    days.forEach((day) => {
                        // モック用のデータを作成
                        mockRaceEntityList.push(
                            baseAutoraceCalendarEntity.copy({
                                name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                dateTime: new Date(2024, month, day),
                                grade: grade,
                            }),
                        );
                        mockRaceDataList.push(
                            baseAutoraceCalendarEntity.toDomainData({
                                name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                dateTime: new Date(2024, month, day),
                                grade: grade,
                            }),
                        );
                        if (AUTORACE_SPECIFIED_GRADE_LIST.includes(grade)) {
                            // 期待するデータを作成
                            expectedRaceEntityList.push(
                                baseAutoraceCalendarEntity.copy({
                                    name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                    dateTime: new Date(2024, month, day),
                                    grade: grade,
                                }),
                            );
                            expectedRaceDataList.push(
                                baseAutoraceCalendarEntity.toDomainData({
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
            autoraceRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                {
                    raceDataList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                AUTORACE_SPECIFIED_GRADE_LIST,
            );

            // モックが呼び出されたことを確認
            expect(
                autoraceRaceRepositoryFromStorageImpl.fetchRaceList,
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
            autoraceRaceRepositoryFromStorageImpl.fetchRaceList.mockRejectedValue(
                new Error('Fetch Error'),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                AUTORACE_SPECIFIED_GRADE_LIST,
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
            const mockRaceEntityList: AutoraceRaceEntity[] = [
                baseAutoraceCalendarEntity,
            ];
            autoraceRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                {
                    raceDataList: mockRaceEntityList,
                },
            );

            // updateEventsがエラーをスローするようにモック
            calendarServiceMock.upsertEvents.mockRejectedValue(
                new Error('Update Error'),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                AUTORACE_SPECIFIED_GRADE_LIST,
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
