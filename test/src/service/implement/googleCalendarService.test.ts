import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { GoogleCalendarService } from '../../../../lib/src/service/implement/googleCalendarService';
import { google } from 'googleapis';
import { GaxiosPromise } from 'gaxios';
import { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import { JraRaceData } from '../../../../lib/src/domain/jraRaceData';

// googleapis のモック設定
jest.mock('googleapis', () => {
    const eventsListMock = jest.fn();
    return {
        google: {
            calendar: jest.fn().mockReturnValue({
                events: {
                    list: eventsListMock,
                    get: eventsListMock,
                    insert: eventsListMock,
                    update: eventsListMock,
                    delete: eventsListMock,
                },
            }),
            auth: {
                JWT: jest.fn(),
            },
        },
    };
});

/* eslint-disable */
describe('GoogleCalendarService', () => {
    let googleCalendarService: GoogleCalendarService<{}>;

    beforeEach(() => {
        googleCalendarService = new GoogleCalendarService(
            'nar',
            'testNarCalendarId',
        );

        // `events` メソッドをスパイ
        jest.spyOn(google.calendar('v3').events, 'list');
        jest.spyOn(google.calendar('v3').events, 'get');
        jest.spyOn(google.calendar('v3').events, 'insert');
        jest.spyOn(google.calendar('v3').events, 'update');
        jest.spyOn(google.calendar('v3').events, 'delete');

        // `console` メソッドをスパイ
        jest.spyOn(console, 'error');
        jest.spyOn(console, 'log');
        jest.spyOn(console, 'debug');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getEvents', () => {
        it('CalendarData[]が返ってくること', async () => {
            const startDate = new Date('2024-01-01T00:00:00');
            const endDate = new Date('2024-02-01T00:00:00');
            const calendarList = [
                {
                    id: 'testNarEventId',
                    summary: 'testNarEventTitle',
                    start: { dateTime: '2024-01-01T00:00:00' },
                    end: { dateTime: '2024-01-01T00:10:00' },
                    location: 'testLocation',
                    description: 'testDescription',
                },
            ];
            const expected = [
                new CalendarData(
                    'testNarEventId',
                    'testNarEventTitle',
                    new Date('2024-01-01T00:00:00'),
                    new Date('2024-01-01T00:10:00'),
                    'testLocation',
                    'testDescription',
                ),
            ];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: calendarList } });

            const result = await googleCalendarService.getEvents(
                startDate,
                endDate,
            );

            // 期待値と結果を比較
            expect(result).toEqual(expected);
        });

        it('event.idが空の場合、CalendarData[]を返す', async () => {
            const startDate = new Date('2021-01-01T00:00:00');
            const endDate = new Date('2021-01-02T00:00:00');
            const calendarList = [{}];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: calendarList } });

            const result = await googleCalendarService.getEvents(
                startDate,
                endDate,
            );

            // 結果が0件であることを確認
            expect(result).toHaveLength(1);
        });

        it('data.itemsがnullの場合、CalendarData[]を返す', async () => {
            const startDate = new Date('2021-01-01T00:00:00');
            const endDate = new Date('2021-01-02T00:00:00');

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: null } });

            const result = await googleCalendarService.getEvents(
                startDate,
                endDate,
            );

            // 結果が0件であることを確認
            expect(result).toHaveLength(0);
        });
    });

    describe('upsertEvents', () => {
        it('イベントが存在しない場合、新規作成処理が行われること', async () => {
            const narRaceDataList = [
                new NarRaceData(
                    '東京ダービー',
                    new Date('2024-01-01T00:00:00'),
                    '大井',
                    'ダート',
                    2000,
                    'JpnⅠ',
                    11,
                ),
            ];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: [] } });

            // モックの `events.insert` メソッドを設定
            const eventsInsertMock = jest.fn().mockResolvedValue({});
            google.calendar('v3').events.insert = eventsInsertMock;

            await googleCalendarService.upsertEvents(narRaceDataList);

            // `events.insert` メソッドが呼ばれていることを確認
            expect(google.calendar('v3').events.insert).toHaveBeenCalled();

            // console.debugで確認
            expect(console.debug).toHaveBeenCalledWith(
                'Google Calendar APIにレースを登録しました: 東京ダービー',
            );
        });

        it('JRAイベントが存在しない場合、新規作成処理が行われること', async () => {
            googleCalendarService = new GoogleCalendarService(
                'jra',
                'testNarCalendarId',
            );
            const jraRaceDataList = [
                new JraRaceData(
                    '有馬記念',
                    new Date('2024-12-22T15:25:00'),
                    '中山',
                    '芝',
                    2500,
                    'GⅠ',
                    11,
                    5,
                    8,
                ),
                new JraRaceData(
                    '3歳未勝利',
                    new Date('2024-12-22T15:25:00'),
                    '中山',
                    '芝',
                    2500,
                    '未勝利',
                    10,
                    5,
                    8,
                ),
            ];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: [] } });

            // モックの `events.insert` メソッドを設定
            const eventsInsertMock = jest.fn().mockResolvedValue({});
            google.calendar('v3').events.insert = eventsInsertMock;

            await googleCalendarService.upsertEvents(jraRaceDataList);

            // `events.insert` メソッドが呼ばれていることを確認
            expect(google.calendar('v3').events.insert).toHaveBeenCalled();

            // console.debugで確認
            expect(console.debug).toHaveBeenCalledWith(
                'Google Calendar APIにレースを登録しました: 有馬記念',
            );
        });

        it('イベントが存在しない場合、新規作成処理が行われるが、events.insertがエラーを吐く', async () => {
            const narRaceDataList = [
                new NarRaceData(
                    '東京ダービー',
                    new Date('2024-01-01T00:00:00'),
                    '大井',
                    'ダート',
                    2000,
                    'JpnⅠ',
                    11,
                ),
            ];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: [] } });

            // モックの `events.insert` メソッドを設定
            const eventsInsertMock = jest.fn().mockImplementation(() => {
                const promise: GaxiosPromise<void> = new Promise(
                    (_, reject) => {
                        reject(new Error('insert error'));
                    },
                );
                return promise;
            });
            google.calendar('v3').events.insert = eventsInsertMock;

            await googleCalendarService.upsertEvents(narRaceDataList);

            // エラーログが出力されていることを確認
            expect(console.error).toHaveBeenCalledWith(
                '[GoogleCalendarService.createEvent] エラー',
                expect.objectContaining({
                    message:
                        'Google Calendar APIへのレース登録に失敗しました: 東京ダービー',
                }),
            );
            expect(console.error).toHaveBeenCalledWith(
                'Google Calendar APIへのイベント新規登録に失敗しました',
                expect.objectContaining({
                    message:
                        'Google Calendar APIへのレース登録に失敗しました: 東京ダービー',
                }),
            );
        });

        it('イベントが存在する場合、更新処理が行われること', async () => {
            const narRaceDataList = [
                new NarRaceData(
                    '東京ダービー',
                    new Date('2024-06-03T20:10:00'),
                    '大井',
                    'ダート',
                    2000,
                    'JpnⅠ',
                    11,
                ),
            ];

            const mockCalendarData = {
                id: 'nar202406030011',
                summary: '東京ダービー',
                start: { dateTime: '2024-06-03T20:10:00' },
                end: { dateTime: '2024-06-03T20:20:00' },
                location: '大井競馬場',
                description: 'ダート 2000m JpnⅠ',
            };

            const calendarList = [mockCalendarData];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: calendarList } });

            // モックの `events.get` メソッドを設定
            // calendarList[0]のidを指定している
            const eventsGetMock = jest
                .fn()
                .mockResolvedValue({ data: mockCalendarData });
            google.calendar('v3').events.get = eventsGetMock;

            // モックの `events.update` メソッドを設定
            const eventsUpdateMock = jest.fn().mockResolvedValue({});
            google.calendar('v3').events.update = eventsUpdateMock;

            await googleCalendarService.upsertEvents(narRaceDataList);

            // console.debugで確認
            expect(console.debug).toHaveBeenCalledWith(
                'Google Calendar APIにレースを更新しました: 東京ダービー',
            );
        });

        it('イベントが存在する場合、更新処理が行われるが、events.updateがエラーを吐く', async () => {
            const narRaceDataList = [
                new NarRaceData(
                    '東京ダービー',
                    new Date('2024-06-03T20:10:00'),
                    '大井',
                    'ダート',
                    2000,
                    'JpnⅠ',
                    11,
                ),
            ];

            const mockCalendarData = {
                id: 'nar202406030011',
                summary: '東京ダービー',
                start: { dateTime: '2024-06-03T20:10:00' },
                end: { dateTime: '2024-06-03T20:20:00' },
                location: '大井競馬場',
                description: 'ダート 2000m JpnⅠ',
            };

            const calendarList = [mockCalendarData];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: calendarList } });

            // モックの `events.get` メソッドを設定
            const eventsGetMock = jest
                .fn()
                .mockResolvedValue({ data: mockCalendarData });
            google.calendar('v3').events.get = eventsGetMock;

            // モックの `events.update` メソッドを設定
            const eventsUpdateMock = jest.fn().mockImplementation(() => {
                const promise: GaxiosPromise<void> = new Promise(
                    (_, reject) => {
                        reject(new Error('update error'));
                    },
                );
                return promise;
            });
            google.calendar('v3').events.update = eventsUpdateMock;

            await googleCalendarService.upsertEvents(narRaceDataList);

            // エラーログが出力されていることを確認
            expect(console.error).toHaveBeenCalledWith(
                '[GoogleCalendarService.updateEvent] エラー',
                expect.objectContaining({
                    message:
                        'Google Calendar APIへのレース更新に失敗しました: 東京ダービー',
                }),
            );
            expect(console.error).toHaveBeenCalledWith(
                '[GoogleCalendarService.updateEvent] エラー',
                expect.objectContaining({
                    message:
                        'Google Calendar APIへのレース更新に失敗しました: 東京ダービー',
                }),
            );
        });
    });

    describe('cleansingEvents', () => {
        it('該当イベントが存在する場合、削除処理が行われること', async () => {
            const startDate = new Date('2024-01-01T00:00:00');
            const endDate = new Date('2024-02-01T00:00:00');
            const calendarList = [
                {
                    id: 'testNarEventId',
                    summary: 'testNarEventTitle',
                    start: { dateTime: '2024-01-01T00:00:00' },
                    end: { dateTime: '2024-01-01T00:10:00' },
                    location: 'testLocation',
                    description: 'testDescription',
                },
            ];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: calendarList } });

            // モックの `events.delete` メソッドを設定 正常に削除されたことを確認
            const eventsDeleteMock = jest.fn().mockResolvedValue({});
            google.calendar('v3').events.delete = eventsDeleteMock;

            await googleCalendarService.cleansingEvents(startDate, endDate);

            // `events.delete` メソッドが呼ばれていることを確認
            expect(google.calendar('v3').events.delete).toHaveBeenCalled();

            // console.debugでGoogle Calendar APIからレースを削除しました: testNarEventTitleというログが出力されていることを確認
            expect(console.debug).toHaveBeenCalledWith(
                'Google Calendar APIからレースを削除しました: testNarEventTitle',
            );
        });

        it('該当イベントが空の場合、削除処理が行われないこと', async () => {
            const startDate = new Date('2024-01-01T00:00:00');
            const endDate = new Date('2024-02-01T00:00:00');

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: [] } });

            await googleCalendarService.cleansingEvents(startDate, endDate);
            // console.debugで指定された期間にイベントが見つかりませんでした。というログが出力されていることを確認
            expect(console.debug).toHaveBeenCalledWith(
                '指定された期間にイベントが見つかりませんでした。',
            );
        });

        it('calendar.events.deleteがエラーを返した場合、エラーログが出力されること', async () => {
            const startDate = new Date('2024-01-01T00:00:00');
            const endDate = new Date('2024-02-01T00:00:00');
            const calenderList = [
                {
                    id: 'testNarEventId',
                    summary: 'testNarEventTitle',
                    start: { dateTime: '2024-01-01T00:00:00' },
                    end: { dateTime: '2024-01-01T00:10:00' },
                    location: 'testLocation',
                    description: 'testDescription',
                },
            ];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events
                .list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: calenderList } });

            // モックの `events.delete` メソッドを設定
            const eventsDeleteMock = jest.fn().mockImplementation(() => {
                const promise: GaxiosPromise<void> = new Promise(
                    (_, reject) => {
                        reject(new Error('delete error'));
                    },
                );
                return promise;
            });
            google.calendar('v3').events.delete = eventsDeleteMock;

            await googleCalendarService.cleansingEvents(startDate, endDate);

            // エラーログが出力されていることを確認
            expect(console.error).toHaveBeenCalledWith(
                '[GoogleCalendarService.deleteEvent] エラー',
                expect.objectContaining({
                    message:
                        'Google Calendar APIからのレース削除に失敗しました: testNarEventTitle',
                }),
            );
            expect(console.error).toHaveBeenCalledWith(
                'Google Calendar APIへのレース削除に失敗しました（processEvents）',
                expect.objectContaining({
                    message:
                        'Google Calendar APIからのレース削除に失敗しました: testNarEventTitle',
                }),
            );
        });
    });
});
