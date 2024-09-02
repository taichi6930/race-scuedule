import 'reflect-metadata'; // reflect-metadataをインポート
import { container } from 'tsyringe';
import { NarRaceCalendarUseCase } from '../../../src/usecase/implement/narRaceCalendarUseCase';
import { ICalendarService } from '../../../src/service/interface/ICalendarService';
import { CalendarData } from '../../../src/domain/calendarData';
import { NarRaceData } from '../../../src/domain/narRaceData';
import { NarCalendarServiceMock } from '../../mock/service/calendarServiceMock';
import { IRaceRepository } from '../../../src/repository/interface/IRaceRepository';
import { mockNarRaceRepositoryFromS3Impl } from '../../mock/repository/narRaceRepositoryFromS3Impl';
import { NarPlaceData } from '../../../src/domain/narPlaceData';
import { NarGradeType } from '../../../src/utility/data/raceSpecific';
import { NAR_SPECIFIED_GRADE_LIST } from '../../../src/utility/data/raceSpecific';

describe('NarRaceCalendarUseCase', () => {
    let calendarServiceMock: jest.Mocked<ICalendarService<NarRaceData>>;
    let narRaceRepositoryFromS3Impl: jest.Mocked<IRaceRepository<NarRaceData, NarPlaceData>>;
    let useCase: NarRaceCalendarUseCase;

    beforeEach(() => {
        // ICalendarServiceインターフェースの依存関係を登録
        calendarServiceMock = NarCalendarServiceMock();
        container.register<ICalendarService<NarRaceData>>('ICalendarService', {
            useValue: calendarServiceMock,
        });

        // IRaceRepositoryインターフェースの依存関係を登録
        narRaceRepositoryFromS3Impl = mockNarRaceRepositoryFromS3Impl();
        container.register<IRaceRepository<NarRaceData, NarPlaceData>>('IRaceRepositoryFromS3', {
            useValue: narRaceRepositoryFromS3Impl,
        });

        // NarRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(NarRaceCalendarUseCase);
    });

    const baseCalendarData = new CalendarData(
        'test202408014411',
        '東京大賞典',
        new Date('2023-08-01T10:00:00Z'),
        new Date('2023-08-01T10:10:00Z'),
        '大井競馬場',
        'テスト',
    );

    describe('getRacesFromCalendar', () => {
        it('CalendarDataのリストが正常に返ってくること', async () => {
            const mockCalendarData: CalendarData[] = [baseCalendarData,];

            // モックの戻り値を設定
            calendarServiceMock.getEvents.mockResolvedValue(mockCalendarData);

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            const result = await useCase.getRacesFromCalendar(startDate, finishDate);

            expect(calendarServiceMock.getEvents).toHaveBeenCalledWith(startDate, finishDate);
            expect(result).toEqual(mockCalendarData);
        });

        it('エラーが発生した場合、空の配列が返ってくること', async () => {
            // モックがエラーをスローするよう設定
            calendarServiceMock.getEvents.mockRejectedValue(new Error('Google Calendar API error'));

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            const result = await useCase.getRacesFromCalendar(startDate, finishDate);

            // モックが呼び出されたことを確認
            expect(calendarServiceMock.getEvents).toHaveBeenCalledWith(startDate, finishDate);
            // モックからエラーが返ってくることを確認
            expect(result).toEqual([]);
        });
    });

    describe('updateRacesToCalendar', () => {
        const baseCalendarData = new CalendarData(
            'test202408014411',
            '東京大賞典',
            new Date('2023-08-01T10:00:00Z'),
            new Date('2023-08-01T10:10:00Z'),
            '大井競馬場',
            'テスト',
        );
        const baseNarCalendarData = new NarRaceData(
            `東京大賞典`,
            new Date('2023-08-01'),
            '大井',
            'ダート',
            1600,
            'GⅠ',
            11,
        );

        it('正常に更新できること', async () => {
            const mockRaceDataList: NarRaceData[] = [];
            const expectedRaceDataList: NarRaceData[] = [];

            const grades: NarGradeType[] = ['GⅠ', 'Listed', '未勝利'] as NarGradeType[];
            const months = [1 - 1, 2 - 1, 3 - 1]; // 1月、2月、3月を0ベースで表現
            const days = [1, 2, 3];

            grades.forEach((grade) => {
                months.forEach((month) => {
                    days.forEach((day) => {
                        // モック用のデータを作成
                        mockRaceDataList.push(
                            baseNarCalendarData.copy({
                                name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                dateTime: new Date(2024, month, day),
                                grade: grade,
                            })
                        );
                        if (NAR_SPECIFIED_GRADE_LIST.includes(grade)) {
                            // 期待するデータを作成
                            expectedRaceDataList.push(
                                baseNarCalendarData.copy({
                                    name: `testRace${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
                                    dateTime: new Date(2024, month, day),
                                    grade: grade,
                                })
                            );
                        }
                    });
                });
            });

            // モックが値を返すよう設定
            narRaceRepositoryFromS3Impl.fetchRaceList.mockResolvedValue({
                raceDataList: mockRaceDataList,
            });

            const startDate = new Date('2024-01-01');
            const finishDate = new Date('2024-03-31');

            await useCase.updateRacesToCalendar(startDate, finishDate, NAR_SPECIFIED_GRADE_LIST);

            // モックが呼び出されたことを確認
            expect(narRaceRepositoryFromS3Impl.fetchRaceList).toHaveBeenCalled();

            // updateEventsが呼び出された回数を確認
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledTimes(1);
            expect(calendarServiceMock.upsertEvents).toHaveBeenCalledWith(expectedRaceDataList);
        });

        it('fetchRaceListがエラーをスローした場合、エラーメッセージがコンソールに表示されること', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            // fetchRaceListがエラーをスローするようにモック
            narRaceRepositoryFromS3Impl.fetchRaceList.mockRejectedValue(new Error('Fetch Error'));

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            await useCase.updateRacesToCalendar(startDate, finishDate, NAR_SPECIFIED_GRADE_LIST);

            // コンソールエラーメッセージが出力されることを確認
            expect(consoleErrorSpy).toHaveBeenCalledWith('Google Calendar APIへのイベント登録に失敗しました', expect.any(Error));

            // エラーがスローされた場合に呼び出されるため、upsertEventsは呼び出されていないことを確認
            consoleErrorSpy.mockRestore();
        });

        it('updateEventsがエラーをスローした場合、エラーメッセージがコンソールに表示されること', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            // fetchRaceListは正常に動作するように設定
            const mockRaceDataList: NarRaceData[] = [
                baseNarCalendarData,
            ];
            narRaceRepositoryFromS3Impl.fetchRaceList.mockResolvedValue({
                raceDataList: mockRaceDataList,
            });

            // updateEventsがエラーをスローするようにモック
            calendarServiceMock.upsertEvents.mockRejectedValue(new Error('Update Error'));

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            await useCase.updateRacesToCalendar(startDate, finishDate, NAR_SPECIFIED_GRADE_LIST);

            // コンソールエラーメッセージが出力されることを確認
            expect(consoleErrorSpy).toHaveBeenCalledWith('Google Calendar APIへのイベント登録に失敗しました', expect.any(Error));

            consoleErrorSpy.mockRestore();
        });
    });

    describe('cleansingRacesFromCalendar', () => {
        it('カレンダーのイベントが正常にクレンジングされること', async () => {
            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            await useCase.cleansingRacesFromCalendar(startDate, finishDate);

            // cleansingEventsが正しく呼び出されたことを確認
            expect(calendarServiceMock.cleansingEvents).toHaveBeenCalledWith(startDate, finishDate);
        });

        it('クレンジング中にエラーが発生した場合、エラーメッセージがコンソールに表示されること', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            // モックがエラーをスローするよう設定
            calendarServiceMock.cleansingEvents.mockRejectedValue(new Error('Cleansing Error'));

            const startDate = new Date('2023-08-01');
            const finishDate = new Date('2023-08-31');

            await useCase.cleansingRacesFromCalendar(startDate, finishDate);

            // コンソールエラーメッセージが出力されることを確認
            expect(consoleErrorSpy).toHaveBeenCalledWith('Google Calendar APIからのイベントクレンジングに失敗しました', expect.any(Error));

            consoleErrorSpy.mockRestore();
        });
    });
});