import type { GaxiosPromise } from 'gaxios';
import { google } from 'googleapis';

import { AutoraceGoogleCalendarService } from '../../../../lib/src/service/implement/autoraceGoogleCalendarService';
import { baseAutoraceRaceEntity } from '../../mock/common/baseAutoraceData';
import { baseAutoraceCalendarData } from '../../mock/common/baseAutoraceData';
import { baseAutoraceCalendarDataFromGoogleCalendar } from '../../mock/common/baseAutoraceData';

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
describe('AutoraceGoogleCalendarService', () => {
    const googleCalendarServiceRecord = new AutoraceGoogleCalendarService(
        'testAutoraceCalendarId',
    );

    const calendarDataListRecord = [baseAutoraceCalendarData];

    const calendarDataListFromGoogleCalendarRecord = [
        baseAutoraceCalendarDataFromGoogleCalendar,
    ];

    const raceEntityRecord = [baseAutoraceRaceEntity];

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

    (['autorace'] as const).forEach((key) => {
        let googleCalendarService: AutoraceGoogleCalendarService;
        let raceDataList: any;
        beforeEach(() => {
            googleCalendarService = googleCalendarServiceRecord;
            raceDataList = raceEntityRecord;
        });
        describe(`${key} getEvents`, () => {
            it(`${key} CalendarData[]が返ってくること`, async () => {
                const startDate = new Date('2024-01-01T00:00:00');
                const finishDate = new Date('2024-02-01T00:00:00');
                const calendarList = calendarDataListFromGoogleCalendarRecord;
                const expected = calendarDataListRecord;

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
                expect(result).toHaveLength(0);
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

            it(`${key} events.listがエラーを吐く`, async () => {
                const startDate = new Date('2021-01-01T00:00:00');
                const finishDate = new Date('2021-01-02T00:00:00');

                // モックの `events.list` メソッドを設定
                const eventsListMock = google.calendar('v3').events
                    .list as jest.Mock;
                eventsListMock.mockImplementation(() => {
                    const promise: GaxiosPromise<void> = new Promise(
                        (_, reject) => {
                            reject(new Error('list error'));
                        },
                    );
                    return promise;
                });

                const result = await googleCalendarService.getEvents(
                    startDate,
                    finishDate,
                );

                // エラーログが出力されていることを確認
                expect(console.error).toHaveBeenCalledWith(
                    `Google Calendar APIからのイベント取得に失敗しました`,
                    new Error('list error'), // エラーオブジェクトも期待値に含める
                );
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
                    `Google Calendar APIにレースを登録しました: ${raceDataList[0].raceData.stage ? `${raceDataList[0].raceData.stage} ` : ``}${raceDataList[0].raceData.name}`,
                );
            });

            it(`${key} イベントが存在しない場合、新規作成処理が行われるが、events.insertがエラーを吐く`, async () => {
                const raceDataList = raceEntityRecord;

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
                const expectedStage = raceDataList[0].raceData.stage
                    ? `${raceDataList[0].raceData.stage} `
                    : '';
                const expectedRaceName = raceDataList[0].raceData.name;

                // 1つ目のエラー: createEvent内のエラー
                // console.errorが呼ばれていることを確認
                expect(console.error);
            });

            it(`${key} イベントが存在する場合、更新処理が行われること`, async () => {
                const mockCalendarData = calendarDataListRecord[0];

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
                    `Google Calendar APIにレースを更新しました: ${raceDataList[0].raceData.name}`,
                );
            });

            it('イベントが存在する場合、更新処理が行われるが、events.updateがエラーを吐く', async () => {
                const mockCalendarData = calendarDataListRecord[0];
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
                expect(console.error);
            });
        });

        describe(`${key} deleteEvents`, () => {
            it('${key} イベントが存在する場合、削除処理が行われること', async () => {
                const mockCalendarData = calendarDataListRecord[0];

                const calendarList = [mockCalendarData];

                const eventsDeleteMock = jest.fn().mockResolvedValue({});
                google.calendar('v3').events.delete = eventsDeleteMock;

                await googleCalendarService.deleteEvents(calendarList);

                // 各イベントの削除が呼び出されることを確認
                expect(
                    google.calendar('v3').events.delete,
                ).toHaveBeenCalledTimes(1);

                // デバッグメッセージを確認
                expect(console.debug).toHaveBeenCalledWith(
                    `Google Calendar APIからレースを削除しました: ${raceDataList[0].raceData.stage ? `${raceDataList[0].raceData.stage} ` : ``}${raceDataList[0].raceData.name}`,
                );
            });

            it(`${key} イベントが存在しない場合、削除処理が行われないこと`, async () => {
                // モックの `events.insert` メソッドを設定
                const eventsDeleteMock = jest.fn().mockResolvedValue({});
                google.calendar('v3').events.delete = eventsDeleteMock;

                await googleCalendarService.deleteEvents([]);

                // `events.delete` メソッドが呼ばれていないことを確認
                expect(
                    google.calendar('v3').events.delete,
                ).not.toHaveBeenCalled();
                // console.debugで確認
                expect(console.debug).toHaveBeenCalledWith(
                    `指定された期間にイベントが見つかりませんでした。`,
                );
            });

            it('イベントが存在する場合で、events.deleteがエラーを吐く', async () => {
                const calendarList = calendarDataListRecord;
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

                await googleCalendarService.deleteEvents(calendarList);

                // 各イベントの削除が呼び出されることを確認
                expect(
                    google.calendar('v3').events.delete,
                ).toHaveBeenCalledTimes(1);

                // エラーログが出力されていることを確認
                expect(console.error).toHaveBeenCalledWith(
                    `Google Calendar APIからのレース削除に失敗しました: ${raceDataList[0].raceData.stage ? `${raceDataList[0].raceData.stage} ` : ``}${raceDataList[0].raceData.name}`,
                    new Error('delete error'), // エラーオブジェクトも期待値に含める
                );
            });
        });
    });
});
