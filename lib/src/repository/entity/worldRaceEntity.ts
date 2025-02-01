import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../domain/calendarData';
import { WorldRaceData } from '../../domain/worldRaceData';
import { WorldRaceRecord } from '../../gateway/record/worldRaceRecord';
import type { WorldRaceId } from '../../utility/data/world/worldRaceId';
import { getJSTDate } from '../../utility/date';
import { formatDate } from '../../utility/format';
import { getWorldGoogleCalendarColorId } from '../../utility/googleCalendar';
import { generateWorldRaceId } from '../../utility/raceId';

/**
 * 海外競馬のレース開催データ
 */
export class WorldRaceEntity {
    /**
     * ID
     */
    public readonly id: WorldRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 海外競馬のレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param updateDate - 更新日時
     */
    constructor(
        id: WorldRaceId | null,
        public readonly raceData: WorldRaceData,
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateWorldRaceId(
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
    copy(partial: Partial<WorldRaceEntity> = {}): WorldRaceEntity {
        return new WorldRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * WorldRaceRecordに変換する
     * @returns
     */
    toRecord(): WorldRaceRecord {
        return WorldRaceRecord.create(
            this.id,
            this.raceData.name,
            this.raceData.dateTime,
            this.raceData.location,
            this.raceData.surfaceType,
            this.raceData.distance,
            this.raceData.grade,
            this.raceData.number,
            this.updateDate,
        );
    }

    /**
     * レースデータをGoogleカレンダーのイベントに変換する（海外競馬）
     * @param raceEntity
     * @returns
     */
    toGoogleCalendarData(): calendar_v3.Schema$Event {
        return {
            id: generateWorldRaceId(
                this.raceData.dateTime,
                this.raceData.location,
                this.raceData.number,
            )
                // GoogleカレンダーのIDにwxyzは入れられない
                // そのため、wxyzを置換する
                // TODO: 正しい置換方法を検討する
                .replace('w', 'vv')
                .replace('x', 'cs')
                .replace('y', 'v')
                .replace('z', 's'),
            summary: this.raceData.name,
            location: `${this.raceData.location}競馬場`,
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
            colorId: getWorldGoogleCalendarColorId(this.raceData.grade),
            description:
                `距離: ${this.raceData.surfaceType}${this.raceData.distance.toString()}m
                発走: ${this.raceData.dateTime.getXDigitHours(2)}:${this.raceData.dateTime.getXDigitMinutes(2)}
                更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
            `.replace(/\n\s+/g, '\n'),
            extendedProperties: {
                private: {
                    raceId: this.id,
                    name: this.raceData.name,
                    dateTime: this.raceData.dateTime.toISOString(),
                    location: this.raceData.location,
                    distance: this.raceData.distance.toString(),
                    surfaceType: this.raceData.surfaceType,
                    grade: this.raceData.grade,
                    number: this.raceData.number.toString(),
                    updateDate: this.updateDate.toISOString(),
                },
            },
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
    ): WorldRaceEntity {
        return new WorldRaceEntity(
            event.extendedProperties?.private?.raceId ?? '',
            WorldRaceData.create(
                event.extendedProperties?.private?.name ?? '',
                new Date(event.extendedProperties?.private?.dateTime ?? ''),
                event.extendedProperties?.private?.location ?? '',
                event.extendedProperties?.private?.surfaceType ?? '',
                Number(event.extendedProperties?.private?.distance ?? -1),
                event.extendedProperties?.private?.grade ?? '',
                Number(event.extendedProperties?.private?.number ?? -1),
            ),
            new Date(event.extendedProperties?.private?.updateDate ?? ''),
        );
    }
}
