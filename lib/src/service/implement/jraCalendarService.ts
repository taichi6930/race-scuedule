import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { DeleteCalendarListRequest } from '../../repository/request/deleteCalendarListRequest';
import { FetchCalendarListRequest } from '../../repository/request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../../repository/request/upsertCalendarListRequest';
import { Logger } from '../../utility/logger';
import { ICalendarService } from '../interface/ICalendarService';

@injectable()
export class JraCalendarService implements ICalendarService<JraRaceEntity> {
    constructor(
        @inject('JraCalendarRepository')
        private readonly calendarRepository: ICalendarRepository<JraRaceEntity>,
    ) {}
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
        const request = new FetchCalendarListRequest(startDate, finishDate);
        const response = await this.calendarRepository.getEvents(request);
        return response.calendarDataList;
    }

    /**
     * カレンダーのイベントの更新を行う
     * @param raceEntityList
     */
    @Logger
    async upsertEvents(raceEntityList: JraRaceEntity[]): Promise<void> {
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
        const events = calendarDataList;
        if (events.length === 0) {
            console.debug('指定された期間にイベントが見つかりませんでした。');
            return;
        }
        const request = new DeleteCalendarListRequest(events);
        await this.calendarRepository.deleteEvents(request);
    }
}
