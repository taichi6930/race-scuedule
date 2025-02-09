import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class WorldRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('WorldCalendarService')
        private readonly calendarService: ICalendarService<WorldRaceEntity>,
        @inject('WorldRaceDataService')
        private readonly worldRaceDataService: IRaceDataService<
            WorldRaceEntity,
            WorldPlaceEntity
        >,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     */
    @Logger
    async getRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        return await this.calendarService.getEvents(startDate, finishDate);
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
        // displayGradeListに含まれるレース情報のみを抽出
        const filteredRaceEntityList: WorldRaceEntity[] = (
            await this.worldRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            )
        ).filter((raceEntity) =>
            displayGradeList.includes(raceEntity.raceData.grade),
        );

        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.calendarService.getEvents(startDate, finishDate);

        // 1. raceEntityListのIDに存在しないcalendarDataListを取得
        const deleteCalendarDataList: CalendarData[] = calendarDataList.filter(
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
    }
}
