import type { calendar_v3 } from 'googleapis';

import { Logger } from '../../utility/logger';
import type { ICalendarGateway } from '../interface/iCalendarGateway';

export class MockGoogleCalendarGateway implements ICalendarGateway {
    /**
     * MockのStorage eventIdとcalendarDataのペア
     */
    private static storageMap = new Map<string, calendar_v3.Schema$Event>();

    constructor(private readonly calendarId: string) {}

    @Logger
    async fetchCalendarDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<calendar_v3.Schema$Event[]> {
        const result = Array.from(
            MockGoogleCalendarGateway.storageMap.values(),
        ).filter((event) => {
            if (event.start?.dateTime && event.end?.dateTime) {
                return (
                    new Date(event.start.dateTime) >= startDate &&
                    new Date(event.end.dateTime) <= finishDate
                );
            }
            return false;
        });
        return Promise.resolve(result);
    }

    @Logger
    updateCalendarData(calendarData: calendar_v3.Schema$Event): Promise<void> {
        // イベントIDが存在しない場合はエラー
        if (!calendarData.id) {
            throw new Error('イベントIDが指定されていません');
        }
        // ストレージにイベントIDが存在しない場合はエラー
        if (!MockGoogleCalendarGateway.storageMap.has(calendarData.id)) {
            throw new Error('指定されたイベントIDが存在しません');
        }
        MockGoogleCalendarGateway.storageMap.set(calendarData.id, calendarData);
        return Promise.resolve();
    }

    @Logger
    insertCalendarData(calendarData: calendar_v3.Schema$Event): Promise<void> {
        // イベントIDが存在しない場合はエラー
        if (!calendarData.id) {
            throw new Error('イベントIDが指定されていません');
        }
        // ストレージにイベントIDが存在する場合はエラー
        if (MockGoogleCalendarGateway.storageMap.has(calendarData.id)) {
            throw new Error('指定されたイベントIDが既に存在します');
        }
        MockGoogleCalendarGateway.storageMap.set(calendarData.id, calendarData);
        return Promise.resolve();
    }

    @Logger
    deleteCalendarData(eventId: string): Promise<void> {
        if (!MockGoogleCalendarGateway.storageMap.has(eventId)) {
            throw new Error('指定されたイベントIDが存在しません');
        }
        MockGoogleCalendarGateway.storageMap.delete(eventId);
        return Promise.resolve();
    }
}
