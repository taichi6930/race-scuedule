import type { WorldRaceEntity } from '../repository/entity/worldRaceEntity';
import type { CalendarData } from './calendarData';

/**
 * カレンダーのデータを表すクラス
 */
export class WorldGoogleCalendarData {
    /**
     * コンストラクタ
     *
     * @remarks
     * カレンダーのデータを生成する
     * @param calendarData - カレンダーのデータ
     * @param raceEntity - レースのエンティティ
     *
     */
    constructor(
        public readonly calendarData: CalendarData,
        public readonly raceEntity: WorldRaceEntity | null,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<WorldGoogleCalendarData> = {},
    ): WorldGoogleCalendarData {
        return new WorldGoogleCalendarData(
            partial.calendarData ?? this.calendarData,
            partial.raceEntity ?? this.raceEntity,
        );
    }
}
