import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../domain/calendarData';
import { KeirinRaceData } from '../../domain/keirinRaceData';
import type { KeirinRacePlayerData } from '../../domain/keirinRacePlayerData';
import { KeirinRacePlayerRecord } from '../../gateway/record/keirinRacePlayerRecord';
import { KeirinRaceRecord } from '../../gateway/record/keirinRaceRecord';
import { KeirinPlaceCodeMap } from '../../utility/data/keirin/keirinRaceCourse';
import type { KeirinRaceId } from '../../utility/data/keirin/keirinRaceId';
import { getJSTDate } from '../../utility/date';
import { createAnchorTag, formatDate } from '../../utility/format';
import { getKeirinGoogleCalendarColorId } from '../../utility/googleCalendar';
import {
    generateKeirinRaceId,
    generateKeirinRacePlayerId,
} from '../../utility/raceId';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceEntity {
    /**
     * ID
     */
    public readonly id: KeirinRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     *
     */
    constructor(
        id: KeirinRaceId | null,
        public readonly raceData: KeirinRaceData,
        public readonly racePlayerDataList: KeirinRacePlayerData[],
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateKeirinRaceId(
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
    copy(partial: Partial<KeirinRaceEntity> = {}): KeirinRaceEntity {
        return new KeirinRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * KeirinRaceRecordに変換する
     * @returns
     */
    toRaceRecord(): KeirinRaceRecord {
        return KeirinRaceRecord.create(
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
            id: generateKeirinRaceId(
                this.raceData.dateTime,
                this.raceData.location,
                this.raceData.number,
            ),
            summary: `${this.raceData.stage} ${this.raceData.name}`,
            location: `${this.raceData.location}競輪場`,
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
            colorId: getKeirinGoogleCalendarColorId(this.raceData.grade),
            description:
                `発走: ${this.raceData.dateTime.getXDigitHours(2)}:${this.raceData.dateTime.getXDigitMinutes(2)}
                ${createAnchorTag('レース情報（netkeirin）', `https://netkeirin.page.link/?link=https%3A%2F%2Fkeirin.netkeiba.com%2Frace%2Fentry%2F%3Frace_id%3D${format(this.raceData.dateTime, 'yyyyMMdd')}${KeirinPlaceCodeMap[this.raceData.location]}${this.raceData.number.toXDigits(2)}`)}
                更新日時: ${format(getJSTDate(new Date()), 'yyyy/MM/dd HH:mm:ss')}
            `.replace(/\n\s+/g, '\n'),
            extendedProperties: {
                private: {
                    raceId: this.id,
                    name: this.raceData.name,
                    stage: this.raceData.stage,
                    dateTime: formatDate(this.raceData.dateTime),
                    location: this.raceData.location,
                    grade: this.raceData.grade,
                    number: this.raceData.number.toString(),
                    updateDate: formatDate(this.updateDate),
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
    ): KeirinRaceEntity {
        return new KeirinRaceEntity(
            event.extendedProperties?.private?.raceId ?? '',
            KeirinRaceData.create(
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
     * KeirinRacePlayerRecordに変換する
     * @returns
     */
    toPlayerRecordList(): KeirinRacePlayerRecord[] {
        return this.racePlayerDataList.map((playerData) =>
            KeirinRacePlayerRecord.create(
                generateKeirinRacePlayerId(
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
