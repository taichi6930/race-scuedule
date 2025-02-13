import 'reflect-metadata';
import '../../utility/format';

import { CalendarData } from '../../domain/calendarData';
import { IRaceEntity } from '../../repository/entity/iRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { FetchCalendarListRequest } from '../../repository/request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../../repository/request/upsertCalendarListRequest';
import { Logger } from '../../utility/logger';
import { ICalendarService } from '../interface/ICalendarService';

/**
 * BaseCalendarService
 */
export abstract class BaseCalendarService<R extends IRaceEntity<R>>
    implements ICalendarService<R>
{
    protected abstract calendarRepository: ICalendarRepository<R>;

    /**
     * カレンダーのイベントの取得を行う
     * @param startDate
     * @param finishDate
     */
    @Logger
    async getEvents(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        const request = new FetchCalendarListRequest(startDate, finishDate);
        return await this.calendarRepository.getEvents(request);
    }

    /**
     * カレンダーのイベントの更新を行う
     * @param raceEntityList
     */
    @Logger
    async upsertEvents(raceEntityList: R[]): Promise<void> {
        if (raceEntityList.length === 0) {
            console.debug('更新対象のイベントが見つかりませんでした。');
            return;
        }
        const request = new UpsertCalendarListRequest(raceEntityList);
        await this.calendarRepository.upsertEvents(request);
    }

    /**
     * イベントの削除を行う
     * @param calendarDataList
     */
    @Logger
    async deleteEvents(calendarDataList: CalendarData[]): Promise<void> {
        if (calendarDataList.length === 0) {
            console.debug('指定された期間にイベントが見つかりませんでした。');
            return;
        }
        await this.calendarRepository.deleteEvents(calendarDataList);
    }
}
