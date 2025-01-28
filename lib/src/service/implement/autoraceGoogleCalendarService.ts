import 'reflect-metadata';
import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import type { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import type { AutoraceGradeType } from '../../utility/data/autorace/autoraceGradeType';
import { getJSTDate } from '../../utility/date';
import { formatDate } from '../../utility/format';
import { generateAutoraceRaceId } from '../../utility/raceId';
import { BaseGoogleCalendarService } from './baseGoogleCalendarService';

export class AutoraceGoogleCalendarService extends BaseGoogleCalendarService<AutoraceRaceEntity> {
    /**
     * イベントIDを生成する
     * netkeiba、netkeirinのレースIDを元に生成
     * @param raceEntity
     * @returns
     */
    protected generateEventId(raceEntity: AutoraceRaceEntity): string {
        return generateAutoraceRaceId(
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
        raceEntity: AutoraceRaceEntity,
    ): calendar_v3.Schema$Event {
        return {
            id: generateAutoraceRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            ),
            summary: `${raceEntity.raceData.stage} ${raceEntity.raceData.name}`,
            location: `${raceEntity.raceData.location}オートレース場`,
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
    private getColorId(raceGrade: AutoraceGradeType): string {
        const gradeColorMap: Record<AutoraceGradeType, string> = {
            SG: '9',
            GⅠ: '9',
            特GⅠ: '9',
            GⅡ: '11',
            開催: '8',
        };
        return gradeColorMap[raceGrade];
    }
}
