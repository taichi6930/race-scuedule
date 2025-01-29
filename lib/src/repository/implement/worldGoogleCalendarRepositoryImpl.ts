import 'reflect-metadata';

import { format } from 'date-fns';
import { calendar_v3 } from 'googleapis';
import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { WorldGoogleCalendarData } from '../../domain/worldGoogleCalendarData';
import { WorldRaceData } from '../../domain/worldRaceData';
import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { WorldRaceId } from '../../utility/data/world/worldRaceId';
import { getJSTDate } from '../../utility/date';
import { formatDate } from '../../utility/format';
import { Logger } from '../../utility/logger';
import { generateWorldRaceId } from '../../utility/raceId';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import { ICalendarRepository } from '../interface/ICalendarRepository';
import { DeleteCalendarListRequest } from '../request/deleteCalendarListRequest';
import { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../request/upsertCalendarListRequest';
import { DeleteCalendarListResponse } from '../response/deleteCalendarListResponse';
import { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';
import { UpsertCalendarListResponse } from '../response/upsertCalendarListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class WorldGoogleCalendarRepositoryImpl
    implements ICalendarRepository<WorldRaceEntity, WorldGoogleCalendarData>
{
    constructor(
        @inject('WorldGoogleCalendarGateway')
        private readonly googleCalendarGateway: ICalendarGateway,
    ) {}
    async getEvents(
        request: FetchCalendarListRequest,
    ): Promise<FetchCalendarListResponse<WorldGoogleCalendarData>> {
        // GoogleカレンダーAPIからイベントを取得
        try {
            const calendarDataList =
                await this.googleCalendarGateway.fetchCalendarDataList(
                    request.startDate,
                    request.finishDate,
                );
            return new FetchCalendarListResponse(
                this.convertToCalendarData(calendarDataList),
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
            return new FetchCalendarListResponse([]);
        }
    }

    @Logger
    async upsertEvents(
        request: UpsertCalendarListRequest<WorldRaceEntity>,
    ): Promise<UpsertCalendarListResponse> {
        const calendarIdMap = new Map<string, WorldRaceId[]>();
        await Promise.all(
            request.raceEntityList.map(async (raceEntity) => {
                // keyに日付（yyyyMMdd）が存在する場合は追加
                if (
                    calendarIdMap.has(
                        format(raceEntity.raceData.dateTime, 'yyyyMMdd'),
                    )
                ) {
                    return;
                }
                // カレンダーListを取得
                const calendarIdList = (
                    await this.googleCalendarGateway.fetchCalendarDataList(
                        new Date(
                            raceEntity.raceData.dateTime.getFullYear(),
                            raceEntity.raceData.dateTime.getMonth(),
                            raceEntity.raceData.dateTime.getDate(),
                        ),
                        new Date(
                            raceEntity.raceData.dateTime.getFullYear(),
                            raceEntity.raceData.dateTime.getMonth(),
                            raceEntity.raceData.dateTime.getDate() + 1,
                        ),
                    )
                )
                    .map((event) => event.id)
                    .filter((id) => id !== undefined && id !== null);

                // カレンダーIDをMapに格納
                calendarIdMap.set(
                    format(raceEntity.raceData.dateTime, 'yyyyMMdd'),
                    calendarIdList,
                );

                // 既に登録されているかどうか判定
                const isExist = calendarIdMap
                    .get(format(raceEntity.raceData.dateTime, 'yyyyMMdd'))
                    ?.some((id) => raceEntity.id.includes(id));

                if (isExist) {
                    // 既に登録されている場合は更新
                    await this.googleCalendarGateway.updateCalendarData(
                        this.translateToCalendarEvent(raceEntity),
                    );
                } else {
                    // 新規登録
                    await this.googleCalendarGateway.insertCalendarData(
                        this.translateToCalendarEvent(raceEntity),
                    );
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
    ): WorldGoogleCalendarData[] {
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
                    const calendarData = new CalendarData(
                        event.id,
                        event.summary,
                        new Date(event.start?.dateTime),
                        new Date(event.end?.dateTime),
                        event.location,
                        event.description,
                    );
                    try {
                        const raceEntity = new WorldRaceEntity(
                            event.extendedProperties?.private?.raceId ?? '',
                            WorldRaceData.create(
                                event.extendedProperties?.private?.name ?? '',
                                new Date(
                                    event.extendedProperties?.private
                                        ?.dateTime ?? '',
                                ),
                                event.extendedProperties?.private?.location ??
                                    '',
                                event.extendedProperties?.private
                                    ?.surfaceType ?? '',
                                Number(
                                    event.extendedProperties?.private
                                        ?.distance ?? 0,
                                ),
                                event.extendedProperties?.private?.grade ?? '',
                                Number(
                                    event.extendedProperties?.private?.number ??
                                        0,
                                ),
                            ),
                            new Date(
                                event.extendedProperties?.private?.updateDate ??
                                    '',
                            ),
                        );
                        return new WorldGoogleCalendarData(
                            calendarData,
                            raceEntity,
                        );
                    } catch (error) {
                        console.error(
                            'Google Calendar APIからのイベントデータ変換に失敗しました',
                            error,
                        );
                        return new WorldGoogleCalendarData(calendarData, null);
                    }
                }
                return undefined;
            })
            .filter((calendarData) => calendarData !== undefined);
    }

    /**
     * レースデータをGoogleカレンダーのイベントに変換する（海外競馬）
     * @param raceEntity
     * @returns
     */
    private translateToCalendarEvent(
        raceEntity: WorldRaceEntity,
    ): calendar_v3.Schema$Event {
        return {
            id: generateWorldRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            )
                .replace('w', 'vv')
                .replace('x', 'cs')
                .replace('y', 'v')
                .replace('z', 's'),
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
                更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
            `.replace(/\n\s+/g, '\n'),
            extendedProperties: {
                private: {
                    raceId: raceEntity.id,
                    name: raceEntity.raceData.name,
                    dateTime: raceEntity.raceData.dateTime.toISOString(),
                    location: raceEntity.raceData.location,
                    distance: raceEntity.raceData.distance.toString(),
                    surfaceType: raceEntity.raceData.surfaceType,
                    grade: raceEntity.raceData.grade,
                    number: raceEntity.raceData.number.toString(),
                    updateDate: raceEntity.updateDate.toISOString(),
                },
            },
        };
    }
    deleteEvents: (
        request: DeleteCalendarListRequest,
    ) => Promise<DeleteCalendarListResponse>;

    /**
     * Googleカレンダーのイベントの色IDを取得する
     * @param raceGrade
     * @returns
     */
    private getColorId(raceGrade: string): string {
        const gradeColorMap: Record<string, string> = {
            GⅠ: '9',
            GⅡ: '11',
            GⅢ: '10',
            Listed: '5',
            重賞: '5',
            オープン: '6',
            オープン特別: '6',
        };
        return gradeColorMap[raceGrade] || '8';
    }
}
