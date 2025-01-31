import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import type { AutoraceRacePlayerData } from '../../domain/autoraceRacePlayerData';
import { CalendarData } from '../../domain/calendarData';
import { AutoraceRacePlayerRecord } from '../../gateway/record/autoraceRacePlayerRecord';
import { AutoraceRaceRecord } from '../../gateway/record/autoraceRaceRecord';
import type { AutoraceGradeType } from '../../utility/data/autorace/autoraceGradeType';
import type { AutoraceRaceId } from '../../utility/data/autorace/autoraceRaceId';
import { getJSTDate } from '../../utility/date';
import { formatDate } from '../../utility/format';
import {
    generateAutoraceRaceId,
    generateAutoraceRacePlayerId,
} from '../../utility/raceId';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceEntity {
    /**
     * ID
     */
    public readonly id: AutoraceRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     *
     */
    constructor(
        id: AutoraceRaceId | null,
        public readonly raceData: AutoraceRaceData,
        public readonly racePlayerDataList: AutoraceRacePlayerData[],
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateAutoraceRaceId(
                raceData.dateTime,
                raceData.location,
                raceData.number,
            );
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoraceRaceEntity> = {}): AutoraceRaceEntity {
        return new AutoraceRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoraceRaceRecordに変換する
     * @returns
     */
    toRaceRecord(): AutoraceRaceRecord {
        return AutoraceRaceRecord.create(
            this.id,
            this.raceData.name,
            this.raceData.stage,
            this.raceData.dateTime,
            this.raceData.location,
            this.raceData.grade,
            this.raceData.number,
            this.updateDate,
        );
    }

    /**
     * レースデータをGoogleカレンダーのイベントに変換する
     * @param raceEntity
     * @returns
     */
    toGoogleCalendarData(): calendar_v3.Schema$Event {
        return {
            id: generateAutoraceRaceId(
                this.raceData.dateTime,
                this.raceData.location,
                this.raceData.number,
            ),
            summary: `${this.raceData.stage} ${this.raceData.name}`,
            location: `${this.raceData.location}オートレース場`,
            start: {
                dateTime: formatDate(this.raceData.dateTime),
                timeZone: 'Asia/Tokyo',
            },
            end: {
                // 終了時刻は発走時刻から10分後とする
                dateTime: formatDate(
                    new Date(this.raceData.dateTime.getTime() + 10 * 60 * 1000),
                ),
                timeZone: 'Asia/Tokyo',
            },
            colorId: this.getColorId(this.raceData.grade),
            description:
                `発走: ${this.raceData.dateTime.getXDigitHours(2)}:${this.raceData.dateTime.getXDigitMinutes(2)}
                          更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
                  `.replace(/\n\s+/g, '\n'),
        };
    }

    static fromGoogleCalendarDataToCalendarData(
        event: calendar_v3.Schema$Event,
    ): CalendarData {
        return new CalendarData(
            event.id ?? '',
            event.summary ?? '',
            new Date(event.start?.dateTime ?? ''),
            new Date(event.end?.dateTime ?? ''),
            event.location ?? '',
            event.description ?? '',
        );
    }

    static fromGoogleCalendarDataToRaceEntity(
        event: calendar_v3.Schema$Event,
    ): AutoraceRaceEntity {
        return new AutoraceRaceEntity(
            event.extendedProperties?.private?.raceId ?? '',
            AutoraceRaceData.create(
                event.extendedProperties?.private?.name ?? '',
                event.extendedProperties?.private?.stage ?? '',
                new Date(event.extendedProperties?.private?.dateTime ?? ''),
                event.extendedProperties?.private?.location ?? '',
                event.extendedProperties?.private?.grade ?? '',
                Number(event.extendedProperties?.private?.number ?? -1),
            ),
            [],
            new Date(event.extendedProperties?.private?.updateDate ?? ''),
        );
    }

    /**
     * AutoraceRacePlayerRecordに変換する
     * @returns
     */
    toPlayerRecordList(): AutoraceRacePlayerRecord[] {
        return this.racePlayerDataList.map((playerData) =>
            AutoraceRacePlayerRecord.create(
                generateAutoraceRacePlayerId(
                    this.raceData.dateTime,
                    this.raceData.location,
                    this.raceData.number,
                    playerData.positionNumber,
                ),
                this.id,
                playerData.positionNumber,
                playerData.playerNumber,
                this.updateDate,
            ),
        );
    }

    /**
     * Googleカレンダーのイベントの色IDを取得する
     * @param raceGrade
     * @returns
     */
    private getColorId(raceGrade: AutoraceGradeType): string {
        switch (raceGrade) {
            case 'SG':
                return '9';
            case 'GⅠ':
                return '9';
            case '特GⅠ':
                return '9';
            case 'GⅡ':
                return '11';
            case '開催':
                return '8';
            default:
                return '8';
        }
    }
}
