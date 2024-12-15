import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class WorldRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('WorldCalendarService')
        private readonly calendarService: ICalendarService<WorldRaceEntity>,
        @inject('WorldRaceRepositoryFromStorage')
        private readonly worldRaceRepositoryFromStorage: IRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     * @returns CalendarData[]
     */
    @Logger
    async getRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        try {
            return await this.calendarService.getEvents(startDate, finishDate);
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
            return [];
        }
    }
    /**
     * カレンダーの更新を行う
     * @param startDate
     * @param finishDate
     * @param displayGradeList
     */
    @Logger
    async updateRacesToCalendar(
        startDate: Date,
        finishDate: Date,
        displayGradeList: string[],
    ): Promise<void> {
        try {
            // startDateからfinishDateまでレース情報を取得
            const fetchRaceEntityListRequest =
                new FetchRaceListRequest<WorldPlaceEntity>(
                    startDate,
                    finishDate,
                );
            const fetchRaceEntityListResponse =
                await this.worldRaceRepositoryFromStorage.fetchRaceEntityList(
                    fetchRaceEntityListRequest,
                );
            // レース情報を取得
            const raceEntityList: WorldRaceEntity[] =
                fetchRaceEntityListResponse.raceEntityList;

            const filteredRaceEntityList: WorldRaceEntity[] =
                raceEntityList.filter((raceEntity) =>
                    displayGradeList.includes(raceEntity.raceData.grade),
                );

            // レース情報をカレンダーに登録
            await this.calendarService.upsertEvents(filteredRaceEntityList);
        } catch (error) {
            console.error(
                'Google Calendar APIへのイベント登録に失敗しました',
                error,
            );
        }
    }
}
