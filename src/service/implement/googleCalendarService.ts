import 'reflect-metadata';
import { injectable } from 'tsyringe';
import { calendar_v3, google } from 'googleapis';
import { ICalendarService } from '../interface/ICalendarService';
import { Logger } from '../../utility/logger';
import { CalendarData } from '../../domain/calendarData';
import { JWT } from 'google-auth-library';

@injectable()
export class GoogleCalendarService<R extends { [key: string]: any }> implements ICalendarService<R> {
    private credentials: JWT;
    private calendar: calendar_v3.Calendar;
    private raceType: 'jra' | 'nar';
    private calendarId: string;

    constructor(raceType: 'jra' | 'nar', calendarId: string) {
        this.raceType = raceType;
        this.credentials = new google.auth.JWT(
            // client_emailは環境変数から取得
            process.env.GOOGLE_CLIENT_EMAIL,
            undefined,
            // private_keyは環境変数から取得
            process.env.GOOGLE_PRIVATE_KEY,
            ["https://www.googleapis.com/auth/calendar"],
        );
        this.calendar = google.calendar({ version: 'v3', auth: this.credentials });
        this.calendarId = calendarId;
    }

    /**
     * カレンダーのイベントの取得を行う
     * @param startDate
     * @param endDate
     * @returns
     */
    @Logger
    async getEvents(startDate: Date, endDate: Date): Promise<CalendarData[]> {
        // GoogleカレンダーAPIからイベントを取得
        const calendarList = await this.getEventsWithinDateRange(startDate, endDate);
        // イベントデータをCalendarData型に変換
        return this.convertToCalendarData(calendarList);
    }

    /**
     * 期間内のイベントを取得する
     * @param startDate
     * @param endDate
     * @returns
     */
    @Logger
    private async getEventsWithinDateRange(startDate: Date, endDate: Date): Promise<calendar_v3.Schema$Event[]> {
        // orderBy: 'startTime'で開始時刻順に取得
        const response = await this.calendar.events.list({
            calendarId: this.calendarId,
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
            timeZone: 'Asia/Tokyo'
        });
        return response.data.items || [];
    }

    /**
     * イベントデータをCalendarData型に変換
     * @param event
     * @returns
     */
    @Logger
    private convertToCalendarData(events: calendar_v3.Schema$Event[]): CalendarData[] {
        return events.map((event) => new CalendarData(
            event.id || '',
            event.summary || '',
            new Date(event.start?.dateTime || ''),
            new Date(event.end?.dateTime || ''),
            event.location || '',
            event.description || ''
        ));
    }
}
