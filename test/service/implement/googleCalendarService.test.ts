import { CalendarData } from "../../../src/domain/calendarData";
import { GoogleCalendarService } from "../../../src/service/implement/googleCalendarService";
import { google } from 'googleapis';

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
                },
            }),
            auth: {
                JWT: jest.fn(),
            },
        },
    };
});

describe('GoogleCalendarService', () => {
    let googleCalendarService: GoogleCalendarService<{}>;

    beforeEach(() => {
        googleCalendarService = new GoogleCalendarService('nar', 'testNarCalendarId');
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
                }
            ];
            const expected = [
                new CalendarData(
                    'testNarEventId',
                    'testNarEventTitle',
                    new Date('2024-01-01T00:00:00'),
                    new Date('2024-01-01T00:10:00'),
                    'testLocation',
                    'testDescription',
                )
            ];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events.list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: calendarList } });

            const result = await googleCalendarService.getEvents(startDate, endDate);

            // 期待値と結果を比較
            expect(result).toEqual(expected);
        });

        it('event.idが空の場合、CalendarData[]を返す', async () => {
            const startDate = new Date('2021-01-01T00:00:00');
            const endDate = new Date('2021-01-02T00:00:00');
            const calendarList = [{}];
            const expected = [
                new CalendarData(
                    '',
                    '',
                    new Date(''),
                    new Date(''),
                    '',
                    '',
                )
            ];

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events.list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: calendarList } });

            const result = await googleCalendarService.getEvents(startDate, endDate);

            // 結果が0件であることを確認
            expect(result).toHaveLength(1);
        });

        it('data.itemsがnullの場合、CalendarData[]を返す', async () => {
            const startDate = new Date('2021-01-01T00:00:00');
            const endDate = new Date('2021-01-02T00:00:00');

            // モックの `events.list` メソッドを設定
            const eventsListMock = google.calendar('v3').events.list as jest.Mock;
            eventsListMock.mockResolvedValue({ data: { items: null } });

            const result = await googleCalendarService.getEvents(startDate, endDate);

            // 結果が0件であることを確認
            expect(result).toHaveLength(0);
        });
    });
});
