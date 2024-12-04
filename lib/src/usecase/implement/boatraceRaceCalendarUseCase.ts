import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { CalendarData } from '../../domain/calendarData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { ICalendarService } from '../../service/interface/ICalendarService';
import {
    BOATRACE_SPECIFIED_GRADE_AND_STAGE_LIST,
    BoatracePlayerList,
} from '../../utility/data/boatrace';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class BoatraceRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('BoatraceCalendarService')
        private readonly calendarService: ICalendarService<BoatraceRaceData>,
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
        displayGradeList: string[],
    ): Promise<void> {
        try {
            // startDateからfinishDateまでレース情報を取得
            const fetchRaceDataListRequest =
                new FetchRaceListRequest<BoatracePlaceEntity>(
                    startDate,
                    finishDate,
                );
            const fetchRaceDataListResponse =
                await this.boatraceRaceRepositoryFromStorage.fetchRaceList(
                    fetchRaceDataListRequest,
                );
            const raceEntityList = fetchRaceDataListResponse.raceDataList;
            /**
             * 表示対象のレースデータのみに絞り込む
             * - 6以上の優先度を持つレースデータを表示対象とする
             * - raceEntityList.racePlayerDataListの中に選手データ（BoatracePlayerDict）が存在するかを確認する
             */
            const filteredRaceEntityList: BoatraceRaceEntity[] =
                raceEntityList.filter((raceEntity) => {
                    const maxPlayerPriority = raceEntity.racePlayerDataList
                        .map((playerData) => {
                            const player = BoatracePlayerList.find(
                                (boatracePlayer) =>
                                    playerData.playerNumber ===
                                    Number(boatracePlayer.playerNumber),
                            );
                            return player ? player.priority : 0;
                        })
                        .reduce(
                            (maxPriority, playerPriority) =>
                                Math.max(maxPriority, playerPriority),
                            0,
                        );

                    const racePriority: number =
                        BOATRACE_SPECIFIED_GRADE_AND_STAGE_LIST.find(
                            (raceGradeList) => {
                                return (
                                    displayGradeList.includes(
                                        raceEntity.raceData.grade,
                                    ) &&
                                    raceGradeList.grade ===
                                        raceEntity.raceData.grade &&
                                    raceGradeList.stage ===
                                        raceEntity.raceData.stage
                                );
                            },
                        )?.priority ?? 0;

                    return racePriority + maxPlayerPriority >= 6;
                });

            const filteredRaceDataList: BoatraceRaceData[] =
                filteredRaceEntityList.map((raceEntity) => raceEntity.raceData);
            // レース情報をカレンダーに登録
            await this.calendarService.upsertEvents(filteredRaceDataList);
        } catch (error) {
            console.error(
                'Google Calendar APIへのイベント登録に失敗しました',
                error,
            );
        }
    }

    /**
     * カレンダーのクレンジングを行う
     * 既に旧システムのレース情報が登録されている場合、削除する
     * @param startDate
     * @param finishDate
     */
    @Logger
    async cleansingRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
    ): Promise<void> {
        try {
            await this.calendarService.cleansingEvents(startDate, finishDate);
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベントクレンジングに失敗しました',
                error,
            );
        }
    }
}
