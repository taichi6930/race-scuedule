import { format } from 'date-fns';

import { CalendarData } from '../../domain/calendarData';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { RaceEntity } from '../../repository/entity/baseEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { AutoracePlaceCodeMap } from '../../utility/data/autorace/autoraceRaceCourse';
import { ENV } from '../../utility/env';
import { Logger } from '../../utility/logger';
import { GoogleCalendarService } from '../implement/googleCalendarService';
import type { ICalendarService } from '../interface/ICalendarService';

/**
 * GoogleカレンダーのAutorace用モックサービス
 */

export class MockAutoraceGoogleCalendarService
    implements ICalendarService<RaceEntity>
{
    constructor() {
        this.setCalendarData();
    }

    @Logger
    private setCalendarData(): void {
        switch (ENV) {
            case 'PRODUCTION': // ENV が production の場合、GoogleCalendarService を使用
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA': // ENV が ita の場合、データを後で設定したいので何もしない
                break;
            case 'LOCAL':
                {
                    // 2024年のデータ366日分を作成
                    const startDate = new Date('2024-01-01');
                    const currentDate = new Date(startDate);
                    // whileで回していって、最初の日付の年数と異なったら終了
                    while (
                        currentDate.getFullYear() === startDate.getFullYear()
                    ) {
                        for (let i = 1; i <= 12; i++) {
                            const location = '伊勢崎';
                            const raceId = `autorace${format(currentDate, 'yyyyMMdd')}${AutoracePlaceCodeMap[location]}${i.toXDigits(2)}`;

                            const calendarData = new CalendarData(
                                raceId,
                                `テストレース${raceId}`,
                                new Date(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth(),
                                    currentDate.getDate(),
                                    i + 6,
                                    0,
                                ),
                                new Date(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth(),
                                    currentDate.getDate(),
                                    i + 6,
                                    10,
                                ),
                                location,
                                'testDescription',
                            );
                            MockAutoraceGoogleCalendarService.mockCalendarData.push(
                                calendarData,
                            );
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
                break;
            default:
                throw new Error('Invalid ENV value');
        }
    }

    private static mockCalendarData: CalendarData[] = [];

    @Logger
    getEvents(startDate: Date, finishDate: Date): Promise<CalendarData[]> {
        return Promise.resolve(
            MockAutoraceGoogleCalendarService.mockCalendarData.filter(
                (data) =>
                    data.startTime >= startDate && data.startTime <= finishDate,
            ),
        );
    }

    @Logger
    async upsertEvents(raceEntityList: RaceEntity[]): Promise<void> {
        for (const raceEntity of raceEntityList) {
            const eventId = GoogleCalendarService.generateEventId(
                'autorace',
                raceEntity,
            );
            const existingEventIndex =
                MockAutoraceGoogleCalendarService.mockCalendarData.findIndex(
                    (data) => data.id === eventId,
                );

            const calendarEvent = this.translateToCalendarEvent(raceEntity);

            if (existingEventIndex !== -1) {
                // Update existing event
                MockAutoraceGoogleCalendarService.mockCalendarData[
                    existingEventIndex
                ] = calendarEvent;
            } else {
                // Insert new event
                MockAutoraceGoogleCalendarService.mockCalendarData.push(
                    calendarEvent,
                );
            }
        }
        return Promise.resolve();
    }

    @Logger
    async deleteEvents(): Promise<void> {
        // モックの動作を記述
    }

    private translateToCalendarEvent(raceEntity: RaceEntity): CalendarData {
        return new CalendarData(
            GoogleCalendarService.generateEventId('autorace', raceEntity),
            raceEntity instanceof KeirinRaceEntity ||
            raceEntity instanceof AutoraceRaceEntity ||
            raceEntity instanceof BoatraceRaceEntity
                ? `${raceEntity.raceData.name} ${raceEntity.raceData.grade} ${raceEntity.raceData.stage}`
                : `${raceEntity.raceData.name} ${raceEntity.raceData.grade}`,
            raceEntity.raceData.dateTime,
            new Date(raceEntity.raceData.dateTime.getTime() + 10 * 60 * 1000), // Assuming event duration is 10 minutes
            raceEntity.raceData.location,
            `testDescription ${raceEntity.raceData.grade}`,
        );
    }
}
