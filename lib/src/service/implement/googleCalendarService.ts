import 'reflect-metadata';
import '../../utility/format';

import { format } from 'date-fns';
import { JWT } from 'google-auth-library';
import { calendar_v3, google } from 'googleapis';
import { injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { RaceEntity } from '../../repository/entity/baseEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import {
    CHIHO_KEIBA_LIVE_URL,
    ChihoKeibaYoutubeUserIdMap,
    getYoutubeLiveUrl,
} from '../../utility/data/movie';
import { NarBabacodeMap } from '../../utility/data/nar/narRaceCourse';
import { NetkeibaBabacodeMap } from '../../utility/data/netkeiba';
import { getJSTDate } from '../../utility/date';
import { createAnchorTag, formatDate } from '../../utility/format';
import { Logger } from '../../utility/logger';
import {
    generateJraRaceId,
    generateNarRaceId,
    generateWorldRaceId,
} from '../../utility/raceId';
import { ICalendarService } from '../interface/ICalendarService';

export type RaceType = 'jra' | 'nar' | 'world';
@injectable()
export class GoogleCalendarService<R extends RaceEntity>
    implements ICalendarService<R>
{
    private readonly credentials: JWT;
    private readonly calendar: calendar_v3.Calendar;
    private readonly raceType: RaceType;
    private readonly calendarId: string;

    constructor(raceType: RaceType, calendarId: string) {
        this.raceType = raceType;
        this.credentials = new google.auth.JWT(
            // client_emailは環境変数から取得
            process.env.GOOGLE_CLIENT_EMAIL,
            undefined,
            // private_keyは環境変数から取得
            process.env.GOOGLE_PRIVATE_KEY,
            ['https://www.googleapis.com/auth/calendar'],
        );
        this.calendar = google.calendar({
            version: 'v3',
            auth: this.credentials,
        });
        this.calendarId = calendarId;
    }

    /**
     * カレンダーのイベントの取得を行う
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    async getEvents(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        // GoogleカレンダーAPIからイベントを取得
        const calendarList = await this.getEventsWithinDateRange(
            startDate,
            finishDate,
        );
        // イベントデータをCalendarData型に変換
        return this.convertToCalendarData(calendarList);
    }

    /**
     * 期間内のイベントを取得する
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    private async getEventsWithinDateRange(
        startDate: Date,
        finishDate: Date,
    ): Promise<calendar_v3.Schema$Event[]> {
        try {
            // orderBy: 'startTime'で開始時刻順に取得
            const response = await this.calendar.events.list({
                calendarId: this.calendarId,
                timeMin: startDate.toISOString(),
                timeMax: finishDate.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
                timeZone: 'Asia/Tokyo',
            });
            return response.data.items ?? [];
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
            return [];
        }
    }

    /**
     * イベントデータをCalendarData型に変換
     * @param events
     * @returns
     */
    @Logger
    private convertToCalendarData(
        events: calendar_v3.Schema$Event[],
    ): CalendarData[] {
        return events
            .map((event) => {
                if (
                    typeof event.id === 'string' &&
                    typeof event.summary === 'string' &&
                    typeof event.start?.dateTime === 'string' &&
                    typeof event.end?.dateTime === 'string' &&
                    typeof event.location === 'string' &&
                    typeof event.description === 'string'
                ) {
                    return new CalendarData(
                        event.id,
                        event.summary,
                        new Date(event.start?.dateTime),
                        new Date(event.end?.dateTime),
                        event.location,
                        event.description,
                    );
                }
                return undefined;
            })
            .filter((calendarData) => calendarData !== undefined);
    }

    /**
     * カレンダーのイベントの更新を行う
     * @param raceEntityList
     */
    @Logger
    async upsertEvents(raceEntityList: RaceEntity[]): Promise<void> {
        await Promise.all(
            raceEntityList.map(async (raceEntity) => {
                // イベントIDを生成
                const eventId = GoogleCalendarService.generateEventId(
                    this.raceType,
                    raceEntity,
                );
                try {
                    // イベントを取得
                    const event = await this.calendar.events.get({
                        calendarId: this.calendarId,
                        eventId: eventId,
                    });
                    if (
                        event.data.id !== null &&
                        event.data.id !== undefined &&
                        event.data.id.trim() !== ''
                    ) {
                        console.log(
                            `Google Calendar APIにイベントが見つかりました。更新を行います。レース名: ${raceEntity.raceData.name}`,
                        );
                        await this.updateEvent(raceEntity, eventId);
                    } else {
                        // イベントが見つからなかった場合は新規登録
                        console.log(
                            `Google Calendar APIにイベントが見つからなかったため、新規登録します。レース名: ${raceEntity.raceData.name}`,
                        );
                        await this.createEvent(
                            this.translateToCalendarEvent(raceEntity),
                        );
                    }
                } catch (error) {
                    console.debug(error);
                    try {
                        // イベントが見つからなかった場合は新規登録
                        console.log(
                            `Google Calendar APIにイベントが見つからなかったため、新規登録します。レース名: ${raceEntity.raceData.name}`,
                        );
                        await this.createEvent(
                            this.translateToCalendarEvent(raceEntity),
                        );
                    } catch (_error) {
                        console.error(
                            'Google Calendar APIへのイベント新規登録に失敗しました',
                            _error,
                        );
                    }
                }
            }),
        );
    }

    /**
     * イベントを新規登録する
     * @param event
     * @returns
     */
    @Logger
    private async createEvent(event: calendar_v3.Schema$Event): Promise<void> {
        try {
            await this.calendar.events.insert({
                calendarId: this.calendarId,
                requestBody: event,
            });
            console.debug(
                `Google Calendar APIにレースを登録しました: ${event.summary ?? 'No Summary'}`,
            );
        } catch (error) {
            console.debug(error);
            throw new Error(
                `Google Calendar APIへのレース登録に失敗しました: ${event.summary ?? 'No Summary'}`,
            );
        }
    }

    /**
     * イベントを削除する（期間内のイベントを取得して削除）
     * @param calendarList
     * @returns
     */
    @Logger
    async deleteEvents(calendarList: CalendarData[]): Promise<void> {
        const events = calendarList;
        if (events.length === 0) {
            console.debug('指定された期間にイベントが見つかりませんでした。');
            return;
        }
        // イベントを削除
        await Promise.all(
            events.map(async (event) => {
                try {
                    await this.calendar.events.delete({
                        calendarId: this.calendarId,
                        eventId: event.id,
                    });
                    console.debug(
                        `Google Calendar APIからレースを削除しました: ${event.title}`,
                    );
                } catch (error) {
                    console.error(
                        `Google Calendar APIからのレース削除に失敗しました: ${event.title}`,
                        error,
                    );
                }
            }),
        );
    }

    /**
     * イベントIDを生成する
     * netkeiba、netkeirinのレースIDを元に生成
     * @param raceEntity
     * @returns
     */
    static generateEventId(raceType: RaceType, raceEntity: RaceEntity): string {
        switch (raceType) {
            case 'jra': {
                const jraRaceEntity = raceEntity as JraRaceEntity;
                return generateJraRaceId(
                    jraRaceEntity.raceData.dateTime,
                    jraRaceEntity.raceData.location,
                    jraRaceEntity.raceData.number,
                );
            }
            case 'nar': {
                const narRaceEntity = raceEntity as NarRaceEntity;
                return generateNarRaceId(
                    narRaceEntity.raceData.dateTime,
                    narRaceEntity.raceData.location,
                    narRaceEntity.raceData.number,
                );
            }
            case 'world': {
                // w, x, y, zはGoogle Calendar APIのIDで使用できないため、置換
                // https://developers.google.com/calendar/api/v3/reference/events/insert?hl=ja
                const worldRaceEntity = raceEntity as WorldRaceEntity;
                return generateWorldRaceId(
                    worldRaceEntity.raceData.dateTime,
                    worldRaceEntity.raceData.location,
                    worldRaceEntity.raceData.number,
                )
                    .replace('w', 'vv')
                    .replace('x', 'cs')
                    .replace('y', 'v')
                    .replace('z', 's');
            }
        }
    }

    /**
     * イベントを更新する
     * @param raceEntity
     * @param eventId
     * @returns
     */
    @Logger
    private async updateEvent(
        raceEntity: RaceEntity,
        eventId: string,
    ): Promise<void> {
        try {
            await this.calendar.events.update({
                calendarId: this.calendarId,
                eventId: eventId,
                requestBody: this.translateToCalendarEvent(raceEntity),
            });
            console.debug(
                `Google Calendar APIにレースを更新しました: ${raceEntity.raceData.name}`,
            );
        } catch (error) {
            console.debug(error);
            throw new Error(
                `Google Calendar APIへのレース更新に失敗しました: ${raceEntity.raceData.name}`,
            );
        }
    }

    /**
     * raceEntityをGoogleカレンダーのイベントに変換する
     * @param raceEntity
     * @returns
     */
    private translateToCalendarEvent(
        raceEntity: RaceEntity,
    ): calendar_v3.Schema$Event {
        switch (this.raceType) {
            case 'jra':
                return this.translateToCalendarEventForJra(
                    raceEntity as JraRaceEntity,
                );
            case 'nar':
                return this.translateToCalendarEventForNar(
                    raceEntity as NarRaceEntity,
                );
            case 'world':
                return this.translateToCalendarEventForWorld(
                    raceEntity as WorldRaceEntity,
                );
        }
    }

    /**
     * レースデータをGoogleカレンダーのイベントに変換する（JRA）
     * @param raceEntity
     * @returns
     */
    private translateToCalendarEventForJra(
        raceEntity: JraRaceEntity,
    ): calendar_v3.Schema$Event {
        return {
            id: generateJraRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            ),
            summary: raceEntity.raceData.name,
            location: `${raceEntity.raceData.location}競馬場`,
            start: {
                dateTime: formatDate(raceEntity.raceData.dateTime),
                timeZone: 'Asia/Tokyo',
            },
            end: {
                // 終了時刻は発走時刻から10分後とする
                dateTime: formatDate(
                    new Date(
                        raceEntity.raceData.dateTime.getTime() + 10 * 60 * 1000,
                    ),
                ),
                timeZone: 'Asia/Tokyo',
            },
            colorId: this.getColorId(raceEntity.raceData.grade),
            description:
                `距離: ${raceEntity.raceData.surfaceType}${raceEntity.raceData.distance.toString()}m
            発走: ${raceEntity.raceData.dateTime.getXDigitHours(2)}:${raceEntity.raceData.dateTime.getXDigitMinutes(2)}
            ${createAnchorTag('レース情報', `https://netkeiba.page.link/?link=https%3A%2F%2Frace.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D${raceEntity.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[raceEntity.raceData.location]}${raceEntity.raceData.heldTimes.toXDigits(2)}${raceEntity.raceData.heldDayTimes.toXDigits(2)}${raceEntity.raceData.number.toXDigits(2)}`)}
            更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
        `.replace(/\n\s+/g, '\n'),
        };
    }

    /**
     * レースデータをGoogleカレンダーのイベントに変換する（NAR）
     * @param raceEntity
     * @returns
     */
    private translateToCalendarEventForNar(
        raceEntity: NarRaceEntity,
    ): calendar_v3.Schema$Event {
        return {
            id: generateNarRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            ),
            summary: raceEntity.raceData.name,
            location: `${raceEntity.raceData.location}競馬場`,
            start: {
                dateTime: formatDate(raceEntity.raceData.dateTime),
                timeZone: 'Asia/Tokyo',
            },
            end: {
                // 終了時刻は発走時刻から10分後とする
                dateTime: formatDate(
                    new Date(
                        raceEntity.raceData.dateTime.getTime() + 10 * 60 * 1000,
                    ),
                ),
                timeZone: 'Asia/Tokyo',
            },
            colorId: this.getColorId(raceEntity.raceData.grade),
            description:
                `距離: ${raceEntity.raceData.surfaceType}${raceEntity.raceData.distance.toString()}m
            発走: ${raceEntity.raceData.dateTime.getXDigitHours(2)}:${raceEntity.raceData.dateTime.getXDigitMinutes(2)}
            ${createAnchorTag('レース映像（地方競馬LIVE）', CHIHO_KEIBA_LIVE_URL)}
            ${createAnchorTag('レース映像（YouTube）', getYoutubeLiveUrl(ChihoKeibaYoutubeUserIdMap[raceEntity.raceData.location]))}
            ${createAnchorTag('レース情報（netkeiba）', `https://netkeiba.page.link/?link=https%3A%2F%2Fnar.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D${raceEntity.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[raceEntity.raceData.location]}${(raceEntity.raceData.dateTime.getMonth() + 1).toXDigits(2)}${raceEntity.raceData.dateTime.getDate().toXDigits(2)}${raceEntity.raceData.number.toXDigits(2)}`)}
            ${createAnchorTag('レース情報（NAR）', `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=${raceEntity.raceData.dateTime.getFullYear().toString()}%2f${raceEntity.raceData.dateTime.getXDigitMonth(2)}%2f${raceEntity.raceData.dateTime.getXDigitDays(2)}&k_raceNo=${raceEntity.raceData.number.toXDigits(2)}&k_babaCode=${NarBabacodeMap[raceEntity.raceData.location]}`)}
            更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
        `.replace(/\n\s+/g, '\n'),
        };
    }

    /**
     * レースデータをGoogleカレンダーのイベントに変換する（海外競馬）
     * @param raceEntity
     * @returns
     */
    private translateToCalendarEventForWorld(
        raceEntity: WorldRaceEntity,
    ): calendar_v3.Schema$Event {
        return {
            id: generateWorldRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            )
                .replace('w', 'vv')
                .replace('x', 'cs')
                .replace('y', 'v')
                .replace('z', 's'),
            summary: raceEntity.raceData.name,
            location: `${raceEntity.raceData.location}競馬場`,
            start: {
                dateTime: formatDate(raceEntity.raceData.dateTime),
                timeZone: 'Asia/Tokyo',
            },
            end: {
                // 終了時刻は発走時刻から10分後とする
                dateTime: formatDate(
                    new Date(
                        raceEntity.raceData.dateTime.getTime() + 10 * 60 * 1000,
                    ),
                ),
                timeZone: 'Asia/Tokyo',
            },
            colorId: this.getColorId(raceEntity.raceData.grade),
            description:
                `距離: ${raceEntity.raceData.surfaceType}${raceEntity.raceData.distance.toString()}m
            発走: ${raceEntity.raceData.dateTime.getXDigitHours(2)}:${raceEntity.raceData.dateTime.getXDigitMinutes(2)}
            更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
        `.replace(/\n\s+/g, '\n'),
        };
    }

    /**
     * Googleカレンダーのイベントの色IDを取得する
     * @param raceGrade
     * @returns
     */
    private getColorId(raceGrade: string): string {
        const gradeColorMap: Record<string, string> = {
            'GⅠ': '9',
            'J.GⅠ': '9',
            'GⅡ': '11',
            'J.GⅡ': '11',
            'GⅢ': '10',
            'J.GⅢ': '10',
            'JpnⅠ': '1',
            'JpnⅡ': '4',
            'JpnⅢ': '2',
            'Listed': '5',
            'オープン': '6',
            'オープン特別': '6',
            '地方重賞': '3',
        };
        return gradeColorMap[raceGrade] || '8';
    }
}
