import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { JraGradeType } from '../../utility/data/jra';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class JraRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('JraCalendarService')
        private readonly calendarService: ICalendarService<JraRaceEntity>,
        @inject('JraRaceRepositoryFromStorage')
        private readonly jraRaceRepositoryFromStorage: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
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
        displayGradeList: JraGradeType[],
    ): Promise<void> {
        try {
            // displayGradeListに含まれるレース情報のみを抽出
            const filteredRaceEntityList: JraRaceEntity[] = (
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
            const upsertRaceEntityList: JraRaceEntity[] =
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
    ): Promise<JraRaceEntity[]> {
        // startDateからfinishDateまでレース情報を取得
        const fetchRaceEntityListRequest =
            new FetchRaceListRequest<JraPlaceEntity>(startDate, finishDate);
        const fetchRaceEntityListResponse =
            await this.jraRaceRepositoryFromStorage.fetchRaceEntityList(
                fetchRaceEntityListRequest,
            );
        // レース情報を取得
        const raceEntityList: JraRaceEntity[] =
            fetchRaceEntityListResponse.raceEntityList;

        return raceEntityList;
    }
}
