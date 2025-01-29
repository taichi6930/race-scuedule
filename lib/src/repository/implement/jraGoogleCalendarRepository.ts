import 'reflect-metadata';

import { format } from 'date-fns';
import { calendar_v3 } from 'googleapis';
import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { JraGradeType } from '../../utility/data/jra/jraGradeType';
import { JraRaceId } from '../../utility/data/jra/jraRaceId';
import { NetkeibaBabacodeMap } from '../../utility/data/netkeiba';
import { getJSTDate } from '../../utility/date';
import { createAnchorTag, formatDate } from '../../utility/format';
import { Logger } from '../../utility/logger';
import { generateJraRaceId } from '../../utility/raceId';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { ICalendarRepository } from '../interface/ICalendarRepository';
import { DeleteCalendarListRequest } from '../request/deleteCalendarListRequest';
import { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../request/upsertCalendarListRequest';
import { DeleteCalendarListResponse } from '../response/deleteCalendarListResponse';
import { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';
import { UpsertCalendarListResponse } from '../response/upsertCalendarListResponse';

@injectable()
export class JraGoogleCalendarRepository
    implements ICalendarRepository<JraRaceEntity>
{
    constructor(
        @inject('JraGoogleCalendarGateway')
        private readonly googleCalendarGateway: ICalendarGateway,
    ) {}

    @Logger
    async getEvents(
        request: FetchCalendarListRequest,
    ): Promise<FetchCalendarListResponse> {
        const events = await this.googleCalendarGateway.fetchCalendarDataList(
            request.startDate,
            request.finishDate,
        );
        const calendarDataList = this.convertToCalendarData(events);
        return new FetchCalendarListResponse(calendarDataList);
    }

    /**
     * カレンダーのイベントの更新を行う
     * @param request
     * @returns
     */
    @Logger
    async upsertEvents(
        request: UpsertCalendarListRequest<JraRaceEntity>,
    ): Promise<UpsertCalendarListResponse> {
        const existRaceIdMap = new Map<string, JraRaceId[]>();

        await Promise.all(
            request.raceEntityList.map(async (raceEntity) => {
                // イベントIDを生成
                const eventId: JraRaceId = raceEntity.id;

                // 日付を8桁で表示
                const dateString = format(
                    raceEntity.raceData.dateTime,
                    'yyyyMMdd',
                );
                if (!existRaceIdMap.has(dateString)) {
                    try {
                        // イベントを取得
                        const eventList =
                            await this.googleCalendarGateway.fetchCalendarDataList(
                                // 日付の0時0分0秒
                                new Date(
                                    raceEntity.raceData.dateTime.getFullYear(),
                                    raceEntity.raceData.dateTime.getMonth(),
                                    raceEntity.raceData.dateTime.getDate(),
                                ),
                                // 日付の23時59分59秒
                                new Date(
                                    raceEntity.raceData.dateTime.getFullYear(),
                                    raceEntity.raceData.dateTime.getMonth(),
                                    raceEntity.raceData.dateTime.getDate(),
                                    23,
                                    59,
                                    59,
                                ),
                            );
                        // idをキーにしてraceIdを格納
                        existRaceIdMap.set(
                            dateString,
                            eventList
                                .map((event) => event.id ?? '')
                                .filter((id) => id !== ''),
                        );
                    } catch (error) {
                        console.error(
                            'Google Calendar APIからのイベント取得に失敗しました',
                            error,
                        );
                    }
                }

                // existRaceIdMapの[dateString]内に既存のイベントIDが存在するかどうかの判定
                const isExistRaceId: boolean =
                    existRaceIdMap.get(dateString)?.includes(eventId) ?? false;

                // 既存のイベントIDが存在する場合は更新を行う
                if (isExistRaceId) {
                    try {
                        console.log(
                            `Google Calendar APIにイベントが見つかりました。更新を行います。レース名: ${raceEntity.raceData.name}`,
                        );
                        await this.googleCalendarGateway.updateCalendarData(
                            this.translateToCalendarEventForJra(raceEntity),
                        );
                    } catch (error) {
                        console.error(
                            'Google Calendar APIへのイベント更新に失敗しました',
                            error,
                        );
                    }
                } else {
                    try {
                        // 既存のイベントIDが存在しない場合は新規登録を行う
                        console.log(
                            `Google Calendar APIにイベントが見つからなかったため、新規登録します。レース名: ${raceEntity.raceData.name}`,
                        );
                        await this.googleCalendarGateway.insertCalendarData(
                            raceEntity,
                        );
                    } catch (error) {
                        console.error(
                            'Google Calendar APIへのイベント新規登録に失敗しました',
                            error,
                        );
                    }
                }
            }),
        );
        return new UpsertCalendarListResponse(200);
    }

    /**
     * イベントデータをCalendarData型に変換
     * @param events
     * @returns
     */
    @Logger
    private convertToCalendarData(
        events: calendar_v3.Schema$Event[],
    ): CalendarData[] {
        return events
            .map((event) => {
                if (
                    typeof event.id === 'string' &&
                    typeof event.summary === 'string' &&
                    typeof event.start?.dateTime === 'string' &&
                    typeof event.end?.dateTime === 'string' &&
                    typeof event.location === 'string' &&
                    typeof event.description === 'string'
                ) {
                    return new CalendarData(
                        event.id,
                        event.summary,
                        new Date(event.start?.dateTime),
                        new Date(event.end?.dateTime),
                        event.location,
                        event.description,
                    );
                }
                return undefined;
            })
            .filter((calendarData) => calendarData !== undefined);
    }

    /**
     * イベントの削除を行う
     * @param events
     */
    async deleteEvents(
        request: DeleteCalendarListRequest,
    ): Promise<DeleteCalendarListResponse> {
        // イベントを削除
        await Promise.all(
            request.calendarDataList.map(async (event) => {
                try {
                    await this.googleCalendarGateway.deleteCalendarData(
                        event.id,
                    );
                    console.debug(
                        `Google Calendar APIからレースを削除しました: ${event.title}`,
                    );
                } catch (error) {
                    console.error(
                        `Google Calendar APIからのレース削除に失敗しました: ${event.title}`,
                        error,
                    );
                }
            }),
        );
        return new DeleteCalendarListResponse(200);
    }

    /**
     * レースデータをGoogleカレンダーのイベントに変換する（JRA）
     * @param raceEntity
     * @returns
     */
    private translateToCalendarEventForJra(
        raceEntity: JraRaceEntity,
    ): calendar_v3.Schema$Event {
        return {
            id: generateJraRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            ),
            summary: raceEntity.raceData.name,
            location: `${raceEntity.raceData.location}競馬場`,
            start: {
                dateTime: formatDate(raceEntity.raceData.dateTime),
                timeZone: 'Asia/Tokyo',
            },
            end: {
                // 終了時刻は発走時刻から10分後とする
                dateTime: formatDate(
                    new Date(
                        raceEntity.raceData.dateTime.getTime() + 10 * 60 * 1000,
                    ),
                ),
                timeZone: 'Asia/Tokyo',
            },
            colorId: this.getColorId(raceEntity.raceData.grade),
            description:
                `距離: ${raceEntity.raceData.surfaceType}${raceEntity.raceData.distance.toString()}m
                発走: ${raceEntity.raceData.dateTime.getXDigitHours(2)}:${raceEntity.raceData.dateTime.getXDigitMinutes(2)}
                ${createAnchorTag('レース情報', `https://netkeiba.page.link/?link=https%3A%2F%2Frace.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D${raceEntity.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[raceEntity.raceData.location]}${raceEntity.raceData.heldTimes.toXDigits(2)}${raceEntity.raceData.heldDayTimes.toXDigits(2)}${raceEntity.raceData.number.toXDigits(2)}`)}
                更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
            `.replace(/\n\s+/g, '\n'),
        };
    }

    /**
     * Googleカレンダーのイベントの色IDを取得する
     * @param raceGrade
     * @returns
     */
    private getColorId(raceGrade: JraGradeType): string {
        const gradeColorMap: Record<JraGradeType, string> = {
            'GⅠ': '9',
            'J.GⅠ': '9',
            'GⅡ': '11',
            'J.GⅡ': '11',
            'GⅢ': '10',
            'J.GⅢ': '10',
            'JpnⅠ': '1',
            'JpnⅡ': '4',
            'JpnⅢ': '2',
            'Listed': '5',
            'オープン': '6',
            'オープン特別': '6',
        };
        return gradeColorMap[raceGrade] || '8';
    }
}
