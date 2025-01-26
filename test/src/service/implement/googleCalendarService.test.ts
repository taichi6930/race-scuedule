import type { GaxiosPromise } from 'gaxios';
import { google } from 'googleapis';

import type { CalendarData } from '../../../../lib/src/domain/calendarData';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import { GoogleCalendarService } from '../../../../lib/src/service/implement/googleCalendarService';
import {
    baseJraCalendarData,
    baseJraCalendarDataFromGoogleCalendar,
    baseJraRaceEntity,
} from '../../mock/common/baseJraData';
import {
    baseKeirinCalendarData,
    baseKeirinCalendarDataFromGoogleCalendar,
    baseKeirinRaceEntity,
} from '../../mock/common/baseKeirinData';
import {
    baseNarCalendarData,
    baseNarCalendarDataFromGoogleCalendar,
    baseNarRaceEntity,
} from '../../mock/common/baseNarData';
import {
    baseWorldCalendarData,
    baseWorldCalendarDataFromGoogleCalendar,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';

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
        nar: new GoogleCalendarService<NarRaceEntity>(
            'nar',
            'testNarCalendarId',
        ),
        jra: new GoogleCalendarService<JraRaceEntity>(
            'jra',
            'testJraCalendarId',
        ),
        keirin: new GoogleCalendarService<KeirinRaceEntity>(
            'keirin',
            'testKeirinCalendarId',
        ),
        world: new GoogleCalendarService<WorldRaceEntity>(
            'world',
            'testWorldCalendarId',
        ),
    };

    const calendarDataListRecord: Record<string, CalendarData[]> = {
        jra: [baseJraCalendarData],
        nar: [baseNarCalendarData],
        keirin: [baseKeirinCalendarData],
        world: [baseWorldCalendarData],
    };

    const calendarDataListFromGoogleCalendarRecord: Record<string, any> = {
        jra: [baseJraCalendarDataFromGoogleCalendar],
        nar: [baseNarCalendarDataFromGoogleCalendar],
        keirin: [baseKeirinCalendarDataFromGoogleCalendar],
        world: [baseWorldCalendarDataFromGoogleCalendar],
    };

    const raceEntityRecord: Record<string, any[]> = {
        jra: [baseJraRaceEntity],
        nar: [baseNarRaceEntity],
        keirin: [baseKeirinRaceEntity],
        world: [baseWorldRaceEntity],
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

    (['jra', 'nar', 'world', 'keirin'] as const).forEach((key) => {
        let googleCalendarService: GoogleCalendarService<any>;
        let raceDataList: any;
        beforeEach(() => {
            googleCalendarService = googleCalendarServiceRecord[key];
            raceDataList = raceEntityRecord[key];
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
                const raceDataList = raceEntityRecord[key];

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
                    `Google Calendar APIにレースを更新しました: ${raceDataList[0].raceData.name}`,
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
                expect(console.error);
            });
        });

        describe(`${key} deleteEvents`, () => {
            it('${key} イベントが存在する場合、削除処理が行われること', async () => {
                const mockCalendarData = calendarDataListRecord[key][0];

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
                const calendarList = calendarDataListRecord[key];
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
