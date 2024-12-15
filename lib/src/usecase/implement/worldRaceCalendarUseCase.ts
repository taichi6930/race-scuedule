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
            // displayGradeListに含まれるレース情報のみを抽出
            const filteredRaceEntityList: WorldRaceEntity[] = (
                await this.fetchRaceEntityList(startDate, finishDate)
            ).filter((raceEntity) =>
                displayGradeList.includes(raceEntity.raceData.grade),
            );

            // カレンダーの取得を行う
            const calendarDataList: CalendarData[] =
                await this.calendarService.getEvents(startDate, finishDate);

            // 1. raceEntityListのIDに存在しないcalendarDataListを取得
            const deleteCalendarDataList: CalendarData[] =
                calendarDataList.filter(
                    (calendarData) =>
                        !filteredRaceEntityList.some(
                            (raceEntity) => raceEntity.id === calendarData.id,
                        ),
                );
            if (deleteCalendarDataList.length > 0) {
                await this.calendarService.deleteEvents(deleteCalendarDataList);
            }

            // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
            const upsertRaceEntityList: WorldRaceEntity[] =
                filteredRaceEntityList.filter(
                    (raceEntity) =>
                        !deleteCalendarDataList.some(
                            (deleteCalendarData) =>
                                deleteCalendarData.id === raceEntity.id,
                        ),
                );
            if (upsertRaceEntityList.length > 0) {
                await this.calendarService.upsertEvents(upsertRaceEntityList);
            }
        } catch (error) {
            console.error(
                'Google Calendar APIへのイベント登録に失敗しました',
                error,
            );
        }
    }

    /**
     * カレンダーの更新を行う
     * @param startDate
     * @param finishDate
     */
    @Logger
    private async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<WorldRaceEntity[]> {
        // startDateからfinishDateまでレース情報を取得
        const fetchRaceEntityListRequest =
            new FetchRaceListRequest<WorldPlaceEntity>(startDate, finishDate);
        const fetchRaceEntityListResponse =
            await this.worldRaceRepositoryFromStorage.fetchRaceEntityList(
                fetchRaceEntityListRequest,
            );
        // レース情報を取得
        const raceEntityList: WorldRaceEntity[] =
            fetchRaceEntityListResponse.raceEntityList;

        return raceEntityList;
    }
}
