import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { BoatraceGradeType } from '../../utility/data/boatrace/boatraceGradeType';
import { BoatracePlayerList } from '../../utility/data/boatrace/boatracePlayerNumber';
import { BoatraceSpecifiedGradeAndStageList } from '../../utility/data/boatrace/boatraceRaceStage';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class BoatraceRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('BoatraceCalendarService')
        private readonly calendarService: ICalendarService<BoatraceRaceEntity>,
        @inject('BoatraceRaceRepositoryFromStorage')
        private readonly boatraceRaceRepositoryFromStorage: IRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
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
        displayGradeList: BoatraceGradeType[],
    ): Promise<void> {
        try {
            const raceEntityList: BoatraceRaceEntity[] =
                await this.fetchRaceEntityList(startDate, finishDate);

            const filteredRaceEntityList: BoatraceRaceEntity[] =
                this.filterRaceEntity(raceEntityList, displayGradeList);

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
            const upsertRaceEntityList: BoatraceRaceEntity[] =
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
    ): Promise<BoatraceRaceEntity[]> {
        // startDateからfinishDateまでレース情報を取得
        const fetchRaceEntityListRequest =
            new FetchRaceListRequest<BoatracePlaceEntity>(
                startDate,
                finishDate,
            );
        const fetchRaceEntityListResponse =
            await this.boatraceRaceRepositoryFromStorage.fetchRaceEntityList(
                fetchRaceEntityListRequest,
            );
        // レース情報を取得
        const raceEntityList: BoatraceRaceEntity[] =
            fetchRaceEntityListResponse.raceEntityList;

        return raceEntityList;
    }

    /**
     * 表示対象のレースデータのみに絞り込む
     * - 6以上の優先度を持つレースデータを表示対象とする
     * - raceEntityList.racePlayerDataListの中に選手データ（BoatracePlayerDict）が存在するかを確認する
     * @param raceEntity[]
     * @return raceEntity[]
     */
    private filterRaceEntity(
        raceEntityList: BoatraceRaceEntity[],
        displayGradeList: BoatraceGradeType[],
    ): BoatraceRaceEntity[] {
        const filteredRaceEntityList: BoatraceRaceEntity[] =
            raceEntityList.filter((raceEntity) => {
                const maxPlayerPriority = raceEntity.racePlayerDataList.reduce(
                    (maxPriority, playerData) => {
                        const playerPriority =
                            BoatracePlayerList.find(
                                (boatracePlayer) =>
                                    playerData.playerNumber ===
                                    Number(boatracePlayer.playerNumber),
                            )?.priority ?? 0;
                        return Math.max(maxPriority, playerPriority);
                    },
                    0,
                );

                const racePriority: number =
                    BoatraceSpecifiedGradeAndStageList.find((raceGradeList) => {
                        return (
                            displayGradeList.includes(
                                raceEntity.raceData.grade,
                            ) &&
                            raceGradeList.grade === raceEntity.raceData.grade &&
                            raceGradeList.stage === raceEntity.raceData.stage
                        );
                    })?.priority ?? 0;

                return racePriority + maxPlayerPriority >= 6;
            });
        return filteredRaceEntityList;
    }
}
