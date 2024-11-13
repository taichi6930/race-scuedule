import type { GaxiosPromise } from 'gaxios';
import { google } from 'googleapis';

import type { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import { GoogleCalendarService } from '../../../../lib/src/service/implement/googleCalendarService';
import {
    baseAutoraceCalendarData,
    baseAutoraceCalendarDataFromGoogleCalendar,
    baseAutoraceRaceData,
    baseJraCalendarData,
    baseJraCalendarDataFromGoogleCalendar,
    baseJraRaceData,
    baseKeirinCalendarData,
    baseKeirinCalendarDataFromGoogleCalendar,
    baseKeirinRaceData,
    baseNarCalendarData,
    baseNarCalendarDataFromGoogleCalendar,
    baseNarRaceData,
    baseWorldCalendarData,
    baseWorldCalendarDataFromGoogleCalendar,
    baseWorldRaceData,
} from '../../mock/common/baseData';

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
    const googleCalendarServiceRecord = {
        nar: new GoogleCalendarService<NarRaceData>('nar', 'testNarCalendarId'),
        jra: new GoogleCalendarService<JraRaceData>('jra', 'testJraCalendarId'),
        keirin: new GoogleCalendarService<KeirinRaceData>(
            'keirin',
            'testKeirinCalendarId',
        ),
        world: new GoogleCalendarService<WorldRaceData>(
            'world',
            'testWorldCalendarId',
        ),
        autorace: new GoogleCalendarService<AutoraceRaceData>(
            'autorace',
            'testAutoraceCalendarId',
        ),
    };

    const calendarDataListRecord: Record<string, CalendarData[]> = {
        jra: [baseJraCalendarData],
        nar: [baseNarCalendarData],
        keirin: [baseKeirinCalendarData],
        world: [baseWorldCalendarData],
        autorace: [baseAutoraceCalendarData],
    };

    const calendarDataListFromGoogleCalendarRecord: Record<string, any> = {
        jra: [baseJraCalendarDataFromGoogleCalendar],
        nar: [baseNarCalendarDataFromGoogleCalendar],
        keirin: [baseKeirinCalendarDataFromGoogleCalendar],
        world: [baseWorldCalendarDataFromGoogleCalendar],
        autorace: [baseAutoraceCalendarDataFromGoogleCalendar],
    };

    const raceDataRecord: Record<string, any> = {
        jra: [baseJraRaceData],
        nar: [baseNarRaceData],
        keirin: [baseKeirinRaceData],
        world: [baseWorldRaceData],
        autorace: [baseAutoraceRaceData],
    };

    beforeEach(() => {
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

    (['jra', 'nar','world','keirin','autorace'] as const).forEach((key) => {
        let googleCalendarService: GoogleCalendarService<any>;
        let raceDataList: any;
        beforeEach(() => {
            googleCalendarService = googleCalendarServiceRecord[key];
            raceDataList = raceDataRecord[key];
        });
        describe(`${key} getEvents`, () => {
            it(`${key} CalendarData[]が返ってくること`, async () => {
                const startDate = new Date('2024-01-01T00:00:00');
                const finishDate = new Date('2024-02-01T00:00:00');
                const calendarList =
                    calendarDataListFromGoogleCalendarRecord[key];
                const expected = calendarDataListRecord[key];

                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockResolvedValue({
                    data: { items: calendarList },
                });

                const result = await googleCalendarService.getEvents(
                    startDate,
                    finishDate,
                );

                // 期待値と結果を比較
                expect(result).toEqual(expected);
            });

            it(`${key} event.idが空の場合、CalendarData[]を返す`, async () => {
                const startDate = new Date('2021-01-01T00:00:00');
                const finishDate = new Date('2021-01-02T00:00:00');
                const calendarList = [{}];

                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockResolvedValue({
                    data: { items: calendarList },
                });

                const result = await googleCalendarService.getEvents(
                    startDate,
                    finishDate,
                );

                // 結果が0件であることを確認
                expect(result).toHaveLength(1);
            });

            it(`${key} data.itemsがnullの場合、CalendarData[]を返す`, async () => {
                const startDate = new Date('2021-01-01T00:00:00');
                const finishDate = new Date('2021-01-02T00:00:00');

                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockResolvedValue({ data: { items: null } });

                const result = await googleCalendarService.getEvents(
                    startDate,
                    finishDate,
                );

                // 結果が0件であることを確認
                expect(result).toHaveLength(0);
            });
        });

        describe(`${key} upsertEvents`, () => {
            it(`${key} イベントが存在しない場合、新規作成処理が行われること`, async () => {
                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockResolvedValue({ data: { items: [] } });

                // モックの `events.insert` メソッドを設定
                const eventsInsertMock = jest.fn().mockResolvedValue({});
                google.calendar('v3').events.insert = eventsInsertMock;

                await googleCalendarService.upsertEvents(raceDataList);

                // `events.insert` メソッドが呼ばれていることを確認
                expect(google.calendar('v3').events.insert).toHaveBeenCalled();

                // console.debugで確認
                expect(console.debug).toHaveBeenCalledWith(
                    `Google Calendar APIにレースを登録しました: ${raceDataList[0].stage ? `${raceDataList[0].stage} ` : ``}${raceDataList[0].name}`,
                );
            });

            it(`${key} イベントが存在しない場合、新規作成処理が行われるが、events.insertがエラーを吐く`, async () => {
                const raceDataList = raceDataRecord[key];

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

                await googleCalendarService.upsertEvents(raceDataList);

                // エラーログが出力されていることを確認
                expect(console.error).toHaveBeenCalledWith(
                    '[GoogleCalendarService.createEvent] エラー',
                    expect.objectContaining({
                        message: `Google Calendar APIへのレース登録に失敗しました: ${raceDataList[0].stage ? `${raceDataList[0].stage} ` : ``}${raceDataList[0].name}`,
                    }),
                );
                expect(console.error).toHaveBeenCalledWith(
                    'Google Calendar APIへのイベント新規登録に失敗しました',
                    expect.objectContaining({
                        message: `Google Calendar APIへのレース登録に失敗しました: ${raceDataList[0].stage ? `${raceDataList[0].stage} ` : ``}${raceDataList[0].name}`,
                    }),
                );
            });

            it(`${key} イベントが存在する場合、更新処理が行われること`, async () => {
                const mockCalendarData = calendarDataListRecord[key][0];

                const calendarList = [mockCalendarData];

                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockResolvedValue({
                    data: { items: calendarList },
                });

                // モックの `events.get` メソッドを設定
                // calendarList[0]のidを指定している
                const eventsGetMock = jest
                    .fn()
                    .mockResolvedValue({ data: mockCalendarData });
                google.calendar('v3').events.get = eventsGetMock;

                // モックの `events.update` メソッドを設定
                const eventsUpdateMock = jest.fn().mockResolvedValue({});
                google.calendar('v3').events.update = eventsUpdateMock;

                await googleCalendarService.upsertEvents(raceDataList);

                // console.debugで確認
                expect(console.debug).toHaveBeenCalledWith(
                    `Google Calendar APIにレースを更新しました: ${raceDataList[0].name}`,
                );
            });

            it('イベントが存在する場合、更新処理が行われるが、events.updateがエラーを吐く', async () => {
                const mockCalendarData = calendarDataListRecord[key][0];
                const calendarList = [mockCalendarData];

                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockResolvedValue({
                    data: { items: calendarList },
                });

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

                await googleCalendarService.upsertEvents(raceDataList);

                // エラーログが出力されていることを確認
                expect(console.error).toHaveBeenCalledWith(
                    '[GoogleCalendarService.updateEvent] エラー',
                    expect.objectContaining({
                        message: `Google Calendar APIへのレース更新に失敗しました: ${raceDataList[0].name}`,
                    }),
                );
                expect(console.error).toHaveBeenCalledWith(
                    '[GoogleCalendarService.updateEvent] エラー',
                    expect.objectContaining({
                        message: `Google Calendar APIへのレース更新に失敗しました: ${raceDataList[0].name}`,
                    }),
                );
            });
        });
        describe(`${key} cleansingEvents`, () => {
            it(`${key} 該当イベントが存在する場合、削除処理が行われること`, async () => {
                const startDate = new Date('2024-01-01T00:00:00');
                const finishDate = new Date('2024-02-01T00:00:00');
                const calendarList =
                    calendarDataListFromGoogleCalendarRecord[key];

                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockResolvedValue({
                    data: { items: calendarList },
                });

                // モックの `events.delete` メソッドを設定 正常に削除されたことを確認
                const eventsDeleteMock = jest.fn().mockResolvedValue({});
                google.calendar('v3').events.delete = eventsDeleteMock;

                await googleCalendarService.cleansingEvents(
                    startDate,
                    finishDate,
                );

                // `events.delete` メソッドが呼ばれていることを確認
                expect(google.calendar('v3').events.delete).toHaveBeenCalled();

                // console.debugでGoogle Calendar APIからレースを削除しました: testNarEventTitleというログが出力されていることを確認
                expect(console.debug).toHaveBeenCalledWith(
                    `Google Calendar APIからレースを削除しました: ${raceDataList[0].name}`,
                );
            });

            it(`${key} 該当イベントが空の場合、削除処理が行われないこと`, async () => {
                const startDate = new Date('2024-01-01T00:00:00');
                const finishDate = new Date('2024-02-01T00:00:00');

                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockResolvedValue({ data: { items: [] } });

                await googleCalendarService.cleansingEvents(
                    startDate,
                    finishDate,
                );
                // console.debugで指定された期間にイベントが見つかりませんでした。というログが出力されていることを確認
                expect(console.debug).toHaveBeenCalledWith(
                    '指定された期間にイベントが見つかりませんでした。',
                );
            });

            it(`${key} calendar.events.deleteがエラーを返した場合、エラーログが出力されること`, async () => {
                const startDate = new Date('2024-01-01T00:00:00');
                const finishDate = new Date('2024-02-01T00:00:00');
                const calenderList =
                    calendarDataListFromGoogleCalendarRecord[key];

                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockResolvedValue({
                    data: { items: calenderList },
                });

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

                await googleCalendarService.cleansingEvents(
                    startDate,
                    finishDate,
                );

                // エラーログが出力されていることを確認
                expect(console.error).toHaveBeenCalledWith(
                    '[GoogleCalendarService.deleteEvent] エラー',
                    expect.objectContaining({
                        message: `Google Calendar APIからのレース削除に失敗しました: ${raceDataList[0].name}`,
                    }),
                );
                expect(console.error).toHaveBeenCalledWith(
                    'Google Calendar APIへのレース削除に失敗しました（processEvents）',
                    expect.objectContaining({
                        message: `Google Calendar APIからのレース削除に失敗しました: ${raceDataList[0].name}`,
                    }),
                );
            });
        });
    });
});
