import type { NarRaceCourse } from '../utility/data/nar/narRaceCourse';
import { validateNarRaceCourse } from '../utility/data/nar/narRaceCourse';
import type { NarRaceDate } from '../utility/data/nar/narRaceDate';
import { validateNarRaceDate } from '../utility/data/nar/narRaceDate';

/**
 * 地方競馬のレース開催場所データ
 */
export class NarPlaceData {
    // 開催日時
    public readonly dateTime: NarRaceDate;
    // 開催場所
    public readonly location: NarRaceCourse;

    private constructor(dateTime: NarRaceDate, location: NarRaceCourse) {
        this.dateTime = dateTime;
        this.location = location;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所 (バリデーション対象)
     * @param grade - オートレースのグレード (バリデーション対象)
     */
    static create(dateTime: Date, location: string): NarPlaceData {
        return new NarPlaceData(
            validateNarRaceDate(dateTime),
            validateNarRaceCourse(location),
        );
    }
    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいNarPlaceDataインスタンス
     */
    copy(partial: Partial<NarPlaceData> = {}): NarPlaceData {
        return NarPlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
