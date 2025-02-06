import { NarPlaceData } from '../../domain/narPlaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import type { NarPlaceId } from '../../utility/data/nar/narPlaceId';
import { validateNarPlaceId } from '../../utility/data/nar/narPlaceId';
import {
    type NarRaceCourse,
    validateNarRaceCourse,
} from '../../utility/data/nar/narRaceCourse';
import {
    type NarRaceDateTime,
    validateNarRaceDateTime,
} from '../../utility/data/nar/narRaceDateTime';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';

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
        public readonly dateTime: NarRaceDateTime,
        public readonly location: NarRaceCourse,
        public readonly updateDate: UpdateDate,
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
                validateNarRaceDateTime(dateTime),
                validateNarRaceCourse(location),
                validateUpdateDate(updateDate),
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
        return NarPlaceEntity.create(
            this.id,
            NarPlaceData.create(this.dateTime, this.location),
            this.updateDate,
        );
    }
}
