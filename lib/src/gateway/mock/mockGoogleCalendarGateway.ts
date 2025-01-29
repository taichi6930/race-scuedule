import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import type { RaceType } from '../../service/implement/googleCalendarService';
import { WorldPlaceCodeMap } from '../../utility/data/world/worldRaceCourse';
import { ENV } from '../../utility/env';
import { formatDate } from '../../utility/format';
import type { ICalendarGateway } from '../interface/iCalendarGateway';

/**
 * Googleカレンダーのモックサービス
 */
export class MockGoogleCalendarGateway implements ICalendarGateway {
    constructor(private readonly raceType: RaceType) {
        this.setCalendarData();
    }

    private static mockCalendarData: Record<
        string,
        calendar_v3.Schema$Event[]
    > = {
        jra: [],
        nar: [],
        world: [],
        keirin: [],
        autorace: [],
        boatrace: [],
    };

    private static isInitialized = false;

    private setCalendarData(): void {
        if (MockGoogleCalendarGateway.isInitialized) {
            return;
        }
        MockGoogleCalendarGateway.isInitialized = true;
        switch (ENV) {
            case 'PRODUCTION': // ENV が production の場合、GoogleCalendarGateway を使用
            case 'TEST':
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
                            let location = '';
                            let raceId = '';

                            switch (this.raceType) {
                                case 'world':
                                    location = 'パリロンシャン';
                                    raceId = `${this.raceType}${format(currentDate, 'yyyyMMdd')}${WorldPlaceCodeMap[location]}${i.toXDigits(2)}`;
                                    break;
                                default:
                                    break;
                            }
                            const calendarDataTranslated: calendar_v3.Schema$Event =
                                {
                                    id: raceId,
                                    summary: `テストレース${raceId}`,
                                    location: location,
                                    start: {
                                        dateTime: formatDate(
                                            new Date(
                                                currentDate.getFullYear(),
                                                currentDate.getMonth(),
                                                currentDate.getDate(),
                                                i + 6,
                                                0,
                                            ),
                                        ),
                                        timeZone: 'Asia/Tokyo',
                                    },
                                    end: {
                                        // 終了時刻は発走時刻から10分後とする
                                        dateTime: formatDate(
                                            new Date(
                                                currentDate.getFullYear(),
                                                currentDate.getMonth(),
                                                currentDate.getDate(),
                                                i + 6,
                                                10,
                                            ),
                                        ),
                                        timeZone: 'Asia/Tokyo',
                                    },
                                    colorId: '8',
                                    description: 'testDescription',
                                };
                            MockGoogleCalendarGateway.mockCalendarData[
                                this.raceType
                            ].push(calendarDataTranslated);
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
                break;
            default:
                throw new Error('Invalid ENV value');
        }
    }

    fetchCalendarDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<calendar_v3.Schema$Event[]> {
        return Promise.resolve(
            MockGoogleCalendarGateway.mockCalendarData[this.raceType].filter(
                (data) =>
                    new Date(data.start?.dateTime ?? '') >= startDate &&
                    new Date(data.start?.dateTime ?? '') <= finishDate,
            ),
        );
    }
    updateCalendarData: (
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;
    insertCalendarData: (
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;
    deleteCalendarData: (eventId: string) => Promise<void>;
}
