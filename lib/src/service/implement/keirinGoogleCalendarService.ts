import 'reflect-metadata';
import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import type { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import type { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import { KeirinPlaceCodeMap } from '../../utility/data/keirin/keirinRaceCourse';
import { getJSTDate } from '../../utility/date';
import { createAnchorTag, formatDate } from '../../utility/format';
import { generateKeirinRaceId } from '../../utility/raceId';
import { BaseGoogleCalendarService } from './baseGoogleCalendarService';

export class KeirinGoogleCalendarService extends BaseGoogleCalendarService<KeirinRaceEntity> {
    /**
     * イベントIDを生成する
     * netkeiba、netkeirinのレースIDを元に生成
     * @param raceEntity
     * @returns
     */
    protected generateEventId(raceEntity: KeirinRaceEntity): string {
        return generateKeirinRaceId(
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
        raceEntity: KeirinRaceEntity,
    ): calendar_v3.Schema$Event {
        return {
            id: generateKeirinRaceId(
                raceEntity.raceData.dateTime,
                raceEntity.raceData.location,
                raceEntity.raceData.number,
            ),
            summary: `${raceEntity.raceData.stage} ${raceEntity.raceData.name}`,
            location: `${raceEntity.raceData.location}競輪場`,
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
            ${createAnchorTag('レース情報（netkeirin）', `https://netkeirin.page.link/?link=https%3A%2F%2Fkeirin.netkeiba.com%2Frace%2Fentry%2F%3Frace_id%3D${format(raceEntity.raceData.dateTime, 'yyyyMMdd')}${KeirinPlaceCodeMap[raceEntity.raceData.location]}${raceEntity.raceData.number.toXDigits(2)}`)}
            更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
        `.replace(/\n\s+/g, '\n'),
        };
    }

    /**
     * Googleカレンダーのイベントの色IDを取得する
     * @param raceGrade
     * @returns
     */
    private getColorId(raceGrade: KeirinGradeType): string {
        const gradeColorMap: Record<KeirinGradeType, string> = {
            GP: '9',
            GⅠ: '9',
            GⅡ: '11',
            GⅢ: '10',
            FⅠ: '8',
            FⅡ: '8',
        };
        return gradeColorMap[raceGrade];
    }
}
