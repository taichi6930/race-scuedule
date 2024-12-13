import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class NarRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('NarCalendarService')
        private readonly calendarService: ICalendarService<NarRaceEntity>,
        @inject('NarRaceRepositoryFromStorage')
        private readonly narRaceRepositoryFromStorage: IRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
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
            const filteredRaceEntityList: NarRaceEntity[] = (
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
            await this.calendarService.deleteEvents(deleteCalendarDataList);

            // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
            const upsertRaceEntityList: NarRaceEntity[] =
                filteredRaceEntityList.filter(
                    (raceEntity) =>
                        !deleteCalendarDataList.some(
                            (deleteCalendarData) =>
                                deleteCalendarData.id === raceEntity.id,
                        ),
                );
            await this.calendarService.upsertEvents(upsertRaceEntityList);
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
    async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<NarRaceEntity[]> {
        // startDateからfinishDateまでレース情報を取得
        const fetchRaceDataListRequest =
            new FetchRaceListRequest<NarPlaceEntity>(startDate, finishDate);
        const fetchRaceDataListResponse =
            await this.narRaceRepositoryFromStorage.fetchRaceEntityList(
                fetchRaceDataListRequest,
            );
        // レース情報を取得
        const raceEntityList: NarRaceEntity[] =
            fetchRaceDataListResponse.raceEntityList;

        return raceEntityList;
    }
}
