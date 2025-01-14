import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import type { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import type { KeirinRaceCourse } from '../../utility/data/keirin/keirinRaceCourse';
import type { KeirinPlaceId } from '../../utility/raceId';

/**
 * Repository層のRecord 競輪のレース開催場所データ
 */
export class KeirinPlaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - 競輪のグレード
     * @param updateDate - 更新日時
     */
    constructor(
        public readonly id: KeirinPlaceId,
        public readonly dateTime: Date,
        public readonly location: KeirinRaceCourse,
        public readonly grade: KeirinGradeType,
        public readonly updateDate: Date,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinPlaceRecord> = {}): KeirinPlaceRecord {
        return new KeirinPlaceRecord(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * KeirinPlaceEntityに変換する
     * @returns
     */
    toEntity(): KeirinPlaceEntity {
        return new KeirinPlaceEntity(
            this.id,
            KeirinPlaceData.create(this.dateTime, this.location, this.grade),
            this.updateDate,
        );
    }
}
