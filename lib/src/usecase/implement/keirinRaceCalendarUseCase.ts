import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { ICalendarService } from '../../service/interface/ICalendarService';
import {
    KEIRIN_SPECIFIED_GRADE_AND_STAGE_LIST,
    KeirinPlayerList,
} from '../../utility/data/keirin';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class KeirinRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('KeirinCalendarService')
        private readonly calendarService: ICalendarService<KeirinRaceEntity>,
        @inject('KeirinRaceRepositoryFromStorage')
        private readonly keirinRaceRepositoryFromStorage: IRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
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
                new FetchRaceListRequest<KeirinPlaceEntity>(
                    startDate,
                    finishDate,
                );
            const fetchRaceDataListResponse =
                await this.keirinRaceRepositoryFromStorage.fetchRaceEntityList(
                    fetchRaceDataListRequest,
                );
            const raceEntityList: KeirinRaceEntity[] =
                fetchRaceDataListResponse.raceEntityList;
            /**
             * 表示対象のレースデータのみに絞り込む
             * - 6以上の優先度を持つレースデータを表示対象とする
             * - raceEntityList.racePlayerDataListの中に選手データ（KeirinPlayerDict）が存在するかを確認する
             */
            const filteredRaceEntityList: KeirinRaceEntity[] =
                raceEntityList.filter((raceEntity) => {
                    const maxPlayerPriority =
                        raceEntity.racePlayerDataList.reduce(
                            (maxPriority, playerData) => {
                                const playerPriority =
                                    KeirinPlayerList.find(
                                        (keirinPlayer) =>
                                            playerData.playerNumber ===
                                            Number(keirinPlayer.playerNumber),
                                    )?.priority ?? 0;
                                return Math.max(maxPriority, playerPriority);
                            },
                            0,
                        );

                    const racePriority: number =
                        KEIRIN_SPECIFIED_GRADE_AND_STAGE_LIST.find(
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
