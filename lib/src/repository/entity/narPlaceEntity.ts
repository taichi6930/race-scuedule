import { NarPlaceData } from '../../domain/narPlaceData';
import type { NarRaceCourse } from '../../utility/data/nar';
import type { NarPlaceId } from '../../utility/raceId';
import { generateNarPlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity 地方競馬のレース開催場所データ
 */
export class NarPlaceEntity {
    /**
     * ID
     */
    public readonly id: NarPlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    constructor(
        id: NarPlaceId | null,
        public readonly dateTime: Date,
        public readonly location: NarRaceCourse,
    ) {
        this.id = id ?? generateNarPlaceId(dateTime, location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarPlaceEntity> = {}): NarPlaceEntity {
        return new NarPlaceEntity(
            partial.id ?? null,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }

    /**
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(partial: Partial<NarPlaceEntity> = {}): NarPlaceData {
        return new NarPlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
