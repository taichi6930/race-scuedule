import { format } from 'date-fns';

import { CalendarData } from '../../domain/calendarData';
import { JraRaceData } from '../../domain/jraRaceData';
import { KeirinRaceData } from '../../domain/keirinRaceData';
import { NarRaceData } from '../../domain/narRaceData';
import { WorldRaceData } from '../../domain/worldRaceData';
import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';
import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';
import {
    JraRaceCourse,
    NarRaceCourse,
    WorldRaceCourse,
} from '../../utility/data/raceSpecific';
import { WORLD_PLACE_CODE } from '../../utility/data/world';
import { ENV } from '../../utility/env';
import { Logger } from '../../utility/logger';
import { RaceData, RaceType } from '../implement/googleCalendarService';
import type { ICalendarService } from '../interface/ICalendarService';

/**
 * Googleカレンダーのモックサービス
 */

export class MockGoogleCalendarService implements ICalendarService<RaceData> {
    constructor(private readonly raceType: RaceType) {
        this.setCalendarData();
    }

    @Logger
    private setCalendarData(): void {
        switch (ENV) {
            case 'PRODUCTION': // ENV が production の場合、GoogleCalendarService を使用
            case 'ITa': // ENV が ita の場合、データを後で設定したいので何もしない
                break;
            case 'LOCAL':
            default:
                {
                    // 2024年のデータ366日分を作成
                    const startDate = new Date('2024-01-01');
                    const currentDate = new Date(startDate);
                    // whileで回していって、最初の日付の年数と異なったら終了
                    while (
                        currentDate.getFullYear() === startDate.getFullYear()
                    ) {
                        for (let i = 1; i <= 12; i++) {
                            let location = '';
                            let raceId = '';

                            switch (this.raceType) {
                                case 'jra':
                                    location = '東京';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${NETKEIBA_BABACODE[location as JraRaceCourse]}${i.toXDigits(2)}`;
                                    break;
                                case 'nar':
                                    location = '大井';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${NETKEIBA_BABACODE[location as NarRaceCourse]}${i.toXDigits(2)}`;
                                    break;
                                case 'world':
                                    location = 'ロンシャン';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${WORLD_PLACE_CODE[location as WorldRaceCourse]}${i.toXDigits(2)}`;
                                    break;
                                case 'keirin':
                                    location = '川崎';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[location]}${i.toXDigits(2)}`;
                                    break;
                                default:
                                    break;
                            }
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
                            MockGoogleCalendarService.mockCalendarData[
                                this.raceType
                            ].push(calendarData);
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
                break;
        }
    }

    private static mockCalendarData: Record<string, CalendarData[]> = {
        jra: [],
        nar: [],
        world: [],
        keirin: [],
    };
    @Logger
    getEvents(startDate: Date, finishDate: Date): Promise<CalendarData[]> {
        return Promise.resolve(
            MockGoogleCalendarService.mockCalendarData[this.raceType].filter(
                (data) =>
                    data.startTime >= startDate && data.startTime <= finishDate,
            ),
        );
    }

    @Logger
    async upsertEvents(raceList: RaceData[]): Promise<void> {
        for (const raceData of raceList) {
            const eventId = this.generateEventId(raceData);
            const existingEventIndex =
                MockGoogleCalendarService.mockCalendarData[
                    this.raceType
                ].findIndex((data) => data.id === eventId);

            const calendarEvent = this.translateToCalendarEvent(raceData);

            if (existingEventIndex !== -1) {
                // Update existing event
                MockGoogleCalendarService.mockCalendarData[this.raceType][
                    existingEventIndex
                ] = calendarEvent;
            } else {
                // Insert new event
                MockGoogleCalendarService.mockCalendarData[this.raceType].push(
                    calendarEvent,
                );
            }
        }
        return Promise.resolve();
    }

    @Logger
    async cleansingEvents(): Promise<void> {
        // モックの動作を記述
    }

    /**
     * イベントIDを生成する
     * netkeiba、netkeirinのレースIDを元に生成
     * @param raceData
     * @returns
     */
    private generateEventId(raceData: RaceData): string {
        switch (this.raceType) {
            case 'jra': {
                const jraRaceData = raceData as JraRaceData;
                return `${this.raceType}${format(raceData.dateTime, 'yyyyMMdd')}${NETKEIBA_BABACODE[jraRaceData.location]}${jraRaceData.number.toXDigits(2)}`;
            }
            case 'nar': {
                const narRaceData = raceData as NarRaceData;
                return `${this.raceType}${format(raceData.dateTime, 'yyyyMMdd')}${NETKEIBA_BABACODE[narRaceData.location]}${narRaceData.number.toXDigits(2)}`;
            }
            case 'world': {
                const worldRaceData = raceData as WorldRaceData;
                return `${this.raceType}${format(raceData.dateTime, 'yyyyMMdd')}${WORLD_PLACE_CODE[worldRaceData.location]}`;
            }
            case 'keirin': {
                const keirinRaceData = raceData as KeirinRaceData;
                return `${this.raceType}${format(raceData.dateTime, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[keirinRaceData.location]}${keirinRaceData.number.toXDigits(2)}`;
            }
        }
    }

    private translateToCalendarEvent(raceData: RaceData): CalendarData {
        return new CalendarData(
            this.generateEventId(raceData),
            raceData instanceof KeirinRaceData
                ? `${raceData.name} ${raceData.grade} ${raceData.stage}`
                : `${raceData.name} ${raceData.grade}`,
            raceData.dateTime,
            new Date(raceData.dateTime.getTime() + 10 * 60 * 1000), // Assuming event duration is 10 minutes
            raceData.location,
            `testDescription ${raceData.grade}`,
        );
    }
}
