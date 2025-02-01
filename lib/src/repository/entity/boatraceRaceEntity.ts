import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import { CalendarData } from '../../domain/calendarData';
import { BoatraceRacePlayerRecord } from '../../gateway/record/boatraceRacePlayerRecord';
import { BoatraceRaceRecord } from '../../gateway/record/boatraceRaceRecord';
import type { BoatraceRaceId } from '../../utility/data/boatrace/boatraceRaceId';
import { getJSTDate } from '../../utility/date';
import { formatDate } from '../../utility/format';
import { getBoatGoogleCalendarColorId } from '../../utility/googleCalendar';
import {
    generateBoatraceRaceId,
    generateBoatraceRacePlayerId,
} from '../../utility/raceId';

/**
 * ボートレースのレース開催データ
 */
export class BoatraceRaceEntity {
    /**
     * ID
     */
    public readonly id: BoatraceRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     *
     */
    constructor(
        id: BoatraceRaceId | null,
        public readonly raceData: BoatraceRaceData,
        public readonly racePlayerDataList: BoatraceRacePlayerData[],
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateBoatraceRaceId(
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
    copy(partial: Partial<BoatraceRaceEntity> = {}): BoatraceRaceEntity {
        return new BoatraceRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * BoatraceRaceRecordに変換する
     * @returns
     */
    toRaceRecord(): BoatraceRaceRecord {
        return BoatraceRaceRecord.create(
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
    toGoogleCalendarData(
        updateDate: Date = new Date(),
    ): calendar_v3.Schema$Event {
        return {
            id: generateBoatraceRaceId(
                this.raceData.dateTime,
                this.raceData.location,
                this.raceData.number,
            ),
            summary: `${this.raceData.stage} ${this.raceData.name}`,
            location: `${this.raceData.location}ボートレース場`,
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
            colorId: getBoatGoogleCalendarColorId(this.raceData.grade),
            description:
                `発走: ${this.raceData.dateTime.getXDigitHours(2)}:${this.raceData.dateTime.getXDigitMinutes(2)}
                          更新日時: ${format(getJSTDate(updateDate), 'yyyy/MM/dd HH:mm:ss')}
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
    ): BoatraceRaceEntity {
        return new BoatraceRaceEntity(
            event.extendedProperties?.private?.raceId ?? '',
            BoatraceRaceData.create(
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
     * BoatraceRacePlayerRecordに変換する
     * @returns
     */
    toPlayerRecordList(): BoatraceRacePlayerRecord[] {
        return this.racePlayerDataList.map((playerData) =>
            BoatraceRacePlayerRecord.create(
                generateBoatraceRacePlayerId(
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
}
