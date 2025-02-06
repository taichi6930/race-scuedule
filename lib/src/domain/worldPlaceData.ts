import type { WorldRaceCourse } from '../utility/data/world/worldRaceCourse';
import { validateWorldRaceCourse } from '../utility/data/world/worldRaceCourse';
import type { WorldRaceDate } from '../utility/data/world/worldRaceDate';
import { validateWorldRaceDate } from '../utility/data/world/worldRaceDate';

/**
 * 海外競馬のレース開催場所データ
 */
export class WorldPlaceData {
    /**
     * 開催日
     *
     * @type {WorldRaceDate}
     * @memberof WorldPlaceData
     */
    public readonly dateTime: WorldRaceDate;
    /**
     * 開催場所
     *
     * @type {WorldRaceCourse}
     * @memberof WorldPlaceData
     */
    public readonly location: WorldRaceCourse;

    /**
     * コンストラクタ
     * @param dateTime
     * @param location
     */
    private constructor(dateTime: WorldRaceDate, location: WorldRaceCourse) {
        this.dateTime = dateTime;
        this.location = location;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     */
    static create(dateTime: Date, location: string): WorldPlaceData {
        return new WorldPlaceData(
            validateWorldRaceDate(dateTime),
            validateWorldRaceCourse(location),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいWorldPlaceDataインスタンス
     */
    copy(partial: Partial<WorldPlaceData> = {}): WorldPlaceData {
        return WorldPlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
