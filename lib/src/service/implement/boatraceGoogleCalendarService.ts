import 'reflect-metadata';
import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import type { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import type { BoatraceGradeType } from '../../utility/data/boatrace/boatraceGradeType';
import { getJSTDate } from '../../utility/date';
import { formatDate } from '../../utility/format';
import { generateBoatraceRaceId } from '../../utility/raceId';
import { BaseGoogleCalendarService } from './baseGoogleCalendarService';

export class BoatraceGoogleCalendarService extends BaseGoogleCalendarService<BoatraceRaceEntity> {
    /**
     * イベントIDを生成する
     * netkeiba、netkeirinのレースIDを元に生成
     * @param raceEntity
     * @returns
     */
    protected generateEventId(raceEntity: BoatraceRaceEntity): string {
        return generateBoatraceRaceId(
            raceEntity.raceData.dateTime,
            raceEntity.raceData.location,
            raceEntity.raceData.number,
        );
    }

    /**
     * raceEntityをGoogleカレンダーのイベントに変換する
     * @param raceEntity
     * @returns
     */
    protected translateToCalendarEvent(
        raceEntity: BoatraceRaceEntity,
    ): calendar_v3.Schema$Event {
        return {
            id: generateBoatraceRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            ),
            summary: `${raceEntity.raceData.stage} ${raceEntity.raceData.name}`,
            location: `${raceEntity.raceData.location}ボートレース場`,
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
                `発走: ${raceEntity.raceData.dateTime.getXDigitHours(2)}:${raceEntity.raceData.dateTime.getXDigitMinutes(2)}
                更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
        `.replace(/\n\s+/g, '\n'),
        };
    }

    /**
     * Googleカレンダーのイベントの色IDを取得する
     * @param raceGrade
     * @returns
     */
    private getColorId(raceGrade: BoatraceGradeType): string {
        const gradeColorMap: Record<BoatraceGradeType, string> = {
            SG: '9',
            GⅠ: '9',
            GⅡ: '11',
            GⅢ: '10',
            一般: '8',
        };
        return gradeColorMap[raceGrade];
    }
}
