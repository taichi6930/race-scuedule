import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import type { JraRaceData } from '../../domain/jraRaceData';
import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';
import { createAnchorTag, formatDate } from '../../utility/format';
import { GoogleCalendarService } from './googleCalendarService';

// GoogleCalendarServiceを継承したJraGoogleCalendarServiceを作成
export class JraGoogleCalendarService extends GoogleCalendarService<JraRaceData> {
    constructor(calendarId: string) {
        super('jra', calendarId);
    }

    /**
     * イベントIDを生成する
     * netkeiba、netkeirinのレースIDを元に生成
     * @param raceData
     * @returns
     */
    protected override generateEventId(raceData: JraRaceData): string {
        const jraRaceData = raceData;
        return `${this.raceType}${format(raceData.dateTime, 'yyyyMMdd')}${NETKEIBA_BABACODE[jraRaceData.location]}${jraRaceData.number.toXDigits(2)}`;
    }

    /**
     * raceDataをGoogleカレンダーのイベントに変換する
     * @param raceData
     * @returns
     */
    protected override translateToCalendarEvent(
        raceData: JraRaceData,
    ): calendar_v3.Schema$Event {
        const data: JraRaceData = raceData;
        return {
            id: this.generateEventId(data),
            summary: data.name,
            location: `${data.location}競馬場`,
            start: {
                dateTime: formatDate(data.dateTime),
                timeZone: 'Asia/Tokyo',
            },
            end: {
                // 終了時刻は発走時刻から10分後とする
                dateTime: formatDate(
                    new Date(data.dateTime.getTime() + 10 * 60 * 1000),
                ),
                timeZone: 'Asia/Tokyo',
            },
            colorId: this.getColorId(data.grade),
            description: `距離: ${data.surfaceType}${data.distance.toString()}m
            発走: ${data.dateTime.getXDigitHours(2)}:${data.dateTime.getXDigitMinutes(2)}
            ${createAnchorTag('レース情報', `https://netkeiba.page.link/?link=https%3A%2F%2Frace.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D${data.dateTime.getFullYear().toString()}${NETKEIBA_BABACODE[data.location]}${data.heldTimes.toXDigits(2)}${data.heldDayTimes.toXDigits(2)}${data.number.toXDigits(2)}`)}
        `.replace(/\n\s+/g, '\n'),
        };
    }
}
