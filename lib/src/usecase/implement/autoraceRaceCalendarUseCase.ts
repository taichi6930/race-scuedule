import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { CalendarData } from '../../domain/calendarData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { ICalendarService } from '../../service/interface/ICalendarService';
import {
    AUTORACE_SPECIFIED_GRADE_AND_STAGE_LIST,
    AutoracePlayerList,
} from '../../utility/data/autorace';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class AutoraceRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('AutoraceCalendarService')
        private readonly calendarService: ICalendarService<AutoraceRaceData>,
        @inject('AutoraceRaceRepositoryFromStorage')
        private readonly autoraceRaceRepositoryFromStorage: IRaceRepository<
            AutoraceRaceEntity,
            AutoracePlaceEntity
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
                new FetchRaceListRequest<AutoracePlaceEntity>(
                    startDate,
                    finishDate,
                );
            const fetchRaceDataListResponse =
                await this.autoraceRaceRepositoryFromStorage.fetchRaceList(
                    fetchRaceDataListRequest,
                );
            const raceEntityList = fetchRaceDataListResponse.raceDataList;
            /**
             * 表示対象のレースデータのみに絞り込む
             * - 6以上の優先度を持つレースデータを表示対象とする
             * - raceEntityList.racePlayerDataListの中に選手データ（AutoracePlayerDict）が存在するかを確認する
             */
            const filteredRaceEntityList: AutoraceRaceEntity[] =
                raceEntityList.filter((raceEntity) => {
                    const maxPlayerPriority =
                        raceEntity.racePlayerDataList.reduce(
                            (maxPriority, playerData) => {
                                const playerPriority =
                                    AutoracePlayerList.find(
                                        (autoracePlayer) =>
                                            playerData.playerNumber ===
                                            Number(autoracePlayer.playerNumber),
                                    )?.priority ?? 0;
                                return Math.max(maxPriority, playerPriority);
                            },
                            0,
                        );

                    const racePriority: number =
                        AUTORACE_SPECIFIED_GRADE_AND_STAGE_LIST.find(
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

            const filteredRaceDataList: AutoraceRaceData[] =
                filteredRaceEntityList.map((raceEntity) =>
                    raceEntity.toDomainData(),
                );
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
