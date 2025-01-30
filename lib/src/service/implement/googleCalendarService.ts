import 'reflect-metadata';
import '../../utility/format';

import { JWT } from 'google-auth-library';
import { calendar_v3, google } from 'googleapis';
import { injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { RaceEntity } from '../../repository/entity/baseEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
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
                return (raceEntity as JraRaceEntity).toGoogleCalendarData();
            case 'nar':
                return (raceEntity as NarRaceEntity).toGoogleCalendarData();
            case 'world':
                return (raceEntity as WorldRaceEntity).toGoogleCalendarData();
        }
    }
}
