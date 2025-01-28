import 'reflect-metadata';

import { calendar_v3 } from 'googleapis';
import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { Logger } from '../../utility/logger';
import { ICalendarRepository } from '../interface/ICalendarRepository';
import { DeleteCalendarListRequest } from '../request/deleteCalendarListRequest';
import { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import { DeleteCalendarListResponse } from '../response/deleteCalendarListResponse';
import { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';

@injectable()
export class JraGoogleCalendarRepository implements ICalendarRepository {
    constructor(
        @inject('GoogleCalendarGateway')
        private readonly googleCalendarGateway: ICalendarGateway,
    ) {}

    @Logger
    async getEvents(
        request: FetchCalendarListRequest,
    ): Promise<FetchCalendarListResponse> {
        const events = await this.googleCalendarGateway.fetchCalendarDataList(
            request.startDate,
            request.finishDate,
        );
        const calendarDataList = this.convertToCalendarData(events);
        return new FetchCalendarListResponse(calendarDataList);
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
     * イベントの削除を行う
     * @param events
     */
    async deleteEvents(
        request: DeleteCalendarListRequest,
    ): Promise<DeleteCalendarListResponse> {
        // イベントを削除
        await Promise.all(
            request.calendarDataList.map(async (event) => {
                try {
                    await this.googleCalendarGateway.deleteCalendarData(
                        event.id,
                    );
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
        return new DeleteCalendarListResponse(200);
    }
}
