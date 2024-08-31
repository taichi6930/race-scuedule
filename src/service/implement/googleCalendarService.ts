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

    /**
     * カレンダーのイベントの更新を行う
     * @param raceList
     */
    @Logger
    async upsertEvents(raceList: R[]): Promise<void> {
        // イベントデータをGoogleカレンダーAPIに登録
    }

    /**
     * カレンダーのクレンジングを行う
     * @param startDate
     * @param endDate
     * @param isLeaveNewData 新しいデータを残すかどうか デフォルトは残す
     */
    @Logger
    async cleansingEvents(startDate: Date, endDate: Date, isLeaveNewData: boolean = true): Promise<void> {
        await this.deleteEvents(startDate, endDate, isLeaveNewData);
    }

    /**
     * イベントを削除する（期間内のイベントを取得して削除）
     * @param startDate
     * @param endDate
     * @param isLeaveNewData 新しいデータを残すかどうか デフォルトは残さない
     * @returns
     */
    @Logger
    private async deleteEvents(startDate: Date, endDate: Date, isLeaveNewData: boolean = false): Promise<void> {
        const events = (await this.getEventsWithinDateRange(startDate, endDate)).filter(event => {
            // trueの場合は削除対象
            // イベントIDが指定したレースタイプで始まっていない場合は削除対象
            // 新しいデータを残さない場合は削除対象
            return !event.id?.startsWith(this.raceType) || !isLeaveNewData;
        });
        if (events.length === 0) {
            console.debug("指定された期間にイベントが見つかりませんでした。");
            return;
        }
        await this.processEvents(events, this.deleteEvent.bind(this), '削除');
    }

    /**
     * イベントを削除する（単体）
     * @param event
     * @returns
     */
    @Logger
    private async deleteEvent(event: calendar_v3.Schema$Event): Promise<void> {
        if (!event.id) return;
        try {
            await this.calendar.events.delete({ calendarId: this.calendarId, eventId: event.id });
            console.debug(`Google Calendar APIからレースを削除しました: ${event.summary}`);
        } catch (error) {
            throw new Error(`Google Calendar APIからのレース削除に失敗しました: ${event.summary}`);
        }
    }

    /**
     * イベントを一括処理する
     * @param events
     * @param action
     * @param actionName
     * @returns
     */
    private async processEvents(
        events: calendar_v3.Schema$Event[],
        action: (event: calendar_v3.Schema$Event, calendarId: string) => Promise<void>,
        actionName: string
    ): Promise<void> {
        try {
            await Promise.all(events.map(event => action(event, this.calendarId)));
            console.log(`Google Calendar APIにレースを${actionName}しました（processEvents）`);
        } catch (error) {
            console.error(`Google Calendar APIへのレース${actionName}に失敗しました（processEvents）`, error);
        }
    }
}
