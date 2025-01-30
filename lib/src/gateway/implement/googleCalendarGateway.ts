import type { JWT } from 'google-auth-library';
import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';

import { Logger } from '../../utility/logger';
import type { ICalendarGateway } from '../interface/iCalendarGateway';

export class GoogleCalendarGateway implements ICalendarGateway {
    private readonly credentials: JWT;
    private readonly calendar: calendar_v3.Calendar;
    private readonly calendarId: string;

    constructor(calendarId: string) {
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

    @Logger
    async fetchCalendarDataList(
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

    @Logger
    async fetchCalendarData(
        eventId: string,
    ): Promise<calendar_v3.Schema$Event> {
        try {
            const response = await this.calendar.events.get({
                calendarId: this.calendarId,
                eventId,
            });
            return response.data;
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
            throw new Error(
                'Google Calendar APIからのイベント取得に失敗しました',
            );
        }
    }

    @Logger
    async updateCalendarData(
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            const eventId = calendarData.id;
            if (!eventId) {
                throw new Error('イベントIDが指定されていません');
            }
            await this.calendar.events.update({
                calendarId: this.calendarId,
                eventId: eventId,
                requestBody: calendarData,
            });
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント更新に失敗しました',
                error,
            );
            throw new Error(
                'Google Calendar APIからのイベント更新に失敗しました',
            );
        }
    }

    @Logger
    async insertCalendarData(
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            await this.calendar.events.insert({
                calendarId: this.calendarId,
                requestBody: calendarData,
            });
        } catch (error) {
            console.error(
                'Google Calendar APIへのイベント新規登録に失敗しました',
                error,
            );
            throw new Error(
                'Google Calendar APIへのイベント新規登録に失敗しました',
            );
        }
    }

    @Logger
    async deleteCalendarData(eventId: string): Promise<void> {
        try {
            await this.calendar.events.delete({
                calendarId: this.calendarId,
                eventId,
            });
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント削除に失敗しました',
                error,
            );
            throw new Error(
                'Google Calendar APIからのイベント削除に失敗しました',
            );
        }
    }
}
