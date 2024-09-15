import 'reflect-metadata'; // reflect-metadataをインポート
import { injectable, inject } from 'tsyringe';
import { CalendarData } from '../../domain/calendarData';
import { NarPlaceData } from '../../domain/narPlaceData';
import { NarRaceData } from '../../domain/narRaceData';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class NarRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('NarCalendarService')
        private readonly calendarService: ICalendarService<NarRaceData>,
        @inject('NarRaceRepositoryFromS3')
        private readonly narRaceRepositoryFromS3: IRaceRepository<
            NarRaceData,
            NarPlaceData
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
                new FetchRaceListRequest<NarPlaceData>(startDate, finishDate);
            const fetchRaceDataListResponse =
                await this.narRaceRepositoryFromS3.fetchRaceList(
                    fetchRaceDataListRequest,
                );
            const { raceDataList } = fetchRaceDataListResponse;

            // displayGradeListに含まれるレース情報のみを抽出
            const filteredRaceDataList: NarRaceData[] = raceDataList.filter(
                (raceData) => displayGradeList.includes(raceData.grade),
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
