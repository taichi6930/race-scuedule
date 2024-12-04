import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import type { ICalendarService } from '../../../../lib/src/service/interface/ICalendarService';
import { KeirinRaceCalendarUseCase } from '../../../../lib/src/usecase/implement/keirinRaceCalendarUseCase';
import type { KeirinGradeType } from '../../../../lib/src/utility/data/keirin';
import { KEIRIN_SPECIFIED_GRADE_LIST } from '../../../../lib/src/utility/data/keirin';
import {
    baseKeirinRaceData,
    baseKeirinRaceEntity,
} from '../../mock/common/baseData';
import { mockKeirinRaceRepositoryFromStorageImpl } from '../../mock/repository/keirinRaceRepositoryFromStorageImpl';
import { CalendarServiceMock } from '../../mock/service/calendarServiceMock';

describe('KeirinRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<KeirinRaceData>>;
    let keirinRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let useCase: KeirinRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = CalendarServiceMock<KeirinRaceData>();
        container.register<ICalendarService<KeirinRaceData>>(
            'KeirinCalendarService',
            {
                useValue: calendarServiceMock,
            },
        );

        // IRaceRepositoryインターフェースの依存関係を登録
        keirinRaceRepositoryFromStorageImpl =
            mockKeirinRaceRepositoryFromStorageImpl();
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromStorage', {
            useValue: keirinRaceRepositoryFromStorageImpl,
        });

        // KeirinRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(KeirinRaceCalendarUseCase);
    });

    const baseCalendarData = new CalendarData(
        'test202512303511',
        'KEIRINグランプリ2025',
        new Date('2025-12-30T10:00:00Z'),
        new Date('2025-12-30T10:10:00Z'),
        '平塚競輪場',
        'テスト',
    );

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseCalendarData];

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
        const baseKeirinCalendarEntity = baseKeirinRaceEntity;

        it('正常に更新できること', async () => {
            const mockRaceDataList: KeirinRaceData[] = [];
            const expectedRaceDataList: KeirinRaceData[] = [];
            const mockRaceEntityList: KeirinRaceEntity[] = [];
            const expectedRaceEntityList: KeirinRaceEntity[] = [];

            const grades: KeirinGradeType[] = ['GP'] as KeirinGradeType[];
            const months = [12 - 1];
            const days = [29, 30, 31];

            grades.forEach((grade) => {
                months.forEach((month) => {
                    days.forEach((day) => {
                        // モック用のデータを作成
                        mockRaceEntityList.push(
                            baseKeirinCalendarEntity.copy({
                                raceData: baseKeirinRaceData.copy({
                                    name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                    dateTime: new Date(2024, month, day),
                                    grade: grade,
                                }),
                            }),
                        );
                        mockRaceDataList.push(
                            baseKeirinCalendarEntity.raceData.copy({
                                name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                dateTime: new Date(2024, month, day),
                                grade: grade,
                            }),
                        );
                        if (KEIRIN_SPECIFIED_GRADE_LIST.includes(grade)) {
                            // 期待するデータを作成
                            expectedRaceEntityList.push(
                                baseKeirinCalendarEntity.copy({
                                    raceData: baseKeirinRaceData.copy({
                                        name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                        dateTime: new Date(2024, month, day),
                                        grade: grade,
                                    }),
                                }),
                            );
                            expectedRaceDataList.push(
                                baseKeirinCalendarEntity.raceData.copy({
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
            keirinRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
                },
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                KEIRIN_SPECIFIED_GRADE_LIST,
            );

            // モックが呼び出されたことを確認
            expect(
                keirinRaceRepositoryFromStorageImpl.fetchRaceList,
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
            keirinRaceRepositoryFromStorageImpl.fetchRaceList.mockRejectedValue(
                new Error('Fetch Error'),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            await useCase.updateRacesToCalendar(
                startDate,
                finishDate,
                KEIRIN_SPECIFIED_GRADE_LIST,
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
            const mockRaceEntityList: KeirinRaceEntity[] = [
                baseKeirinCalendarEntity,
            ];
            keirinRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                {
                    raceEntityList: mockRaceEntityList,
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
                KEIRIN_SPECIFIED_GRADE_LIST,
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
