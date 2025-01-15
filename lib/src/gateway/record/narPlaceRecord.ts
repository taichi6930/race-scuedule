import { NarPlaceData } from '../../domain/narPlaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import {
    type NarRaceCourse,
    validateNarRaceCourse,
} from '../../utility/data/nar/narRaceCourse';
import {
    type NarRaceDate,
    validateNarRaceDate,
} from '../../utility/data/nar/narRaceDate';
import { type NarPlaceId, validateNarPlaceId } from '../../utility/raceId';

/**
 * Repository層のRecord 地方競馬のレース開催場所データ
 */
export class NarPlaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 地方競馬のレース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: NarPlaceId,
        public readonly dateTime: NarRaceDate,
        public readonly location: NarRaceCourse,
        public readonly updateDate: Date,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param updateDate - 更新日時
     */
    static create(
        id: string,
        dateTime: Date,
        location: string,
        updateDate: Date,
    ): NarPlaceRecord {
        try {
            return new NarPlaceRecord(
                validateNarPlaceId(id),
                validateNarRaceDate(dateTime),
                validateNarRaceCourse(location),
                updateDate,
            );
        } catch (e) {
            throw new Error(
                `NarPlaceRecord create error: ${(e as Error).message}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarPlaceRecord> = {}): NarPlaceRecord {
        return NarPlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * NarPlaceEntityに変換する
     * @returns
     */
    toEntity(): NarPlaceEntity {
        return new NarPlaceEntity(
            this.id,
            NarPlaceData.create(this.dateTime, this.location),
            this.updateDate,
        );
    }
}
