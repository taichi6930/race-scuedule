import type { CalendarData } from '../../domain/calendarData';

export interface IRaceCalendarUseCase {
    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     * @returns CalendarData[]
     */
    getRacesFromCalendar: (
        startDate: Date,
        finishDate: Date,
    ) => Promise<CalendarData[]>;
    /**
     * カレンダーの更新を行う
     * @param startDate
     * @param finishDate
     * @param displayGradeList
     * @returns void
     */
    updateRacesToCalendar: (
        startDate: Date,
        finishDate: Date,
        displayGradeList: string[],
    ) => Promise<void>;
}
