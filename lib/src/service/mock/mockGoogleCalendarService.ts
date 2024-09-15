import { CalendarData } from '../../domain/calendarData';
import type { ICalendarService } from '../interface/ICalendarService';
import { addDays, format } from 'date-fns';

/**
 * Googleカレンダーのモックサービス
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MockGoogleCalendarService implements ICalendarService<any> {
    constructor(private readonly raceType: 'jra' | 'nar') {}

    async getEvents(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        const events: CalendarData[] = [];
        for (
            let date = new Date(startDate);
            date <= finishDate;
            date = addDays(date, 1)
        ) {
            events.push(
                new CalendarData(
                    `mock-${this.raceType}-${format(date, 'yyyyMMdd')}-id`,
                    `mock-${this.raceType}-${format(date, 'yyyyMMdd')}-title`,
                    date,
                    date,
                    'testLocation',
                    'testDescription',
                ),
            );
        }
        return events;
    }

    async upsertEvents(): Promise<void> {
        // モックの動作を記述
    }

    async cleansingEvents(): Promise<void> {
        // モックの動作を記述
    }
}
