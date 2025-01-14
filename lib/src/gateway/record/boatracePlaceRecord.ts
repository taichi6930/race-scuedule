import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import type { BoatraceGradeType } from '../../utility/data/boatrace/boatraceGradeType';
import type { BoatraceRaceCourse } from '../../utility/data/boatrace/boatraceRaceCourse';
import type { BoatraceRaceDate } from '../../utility/data/boatrace/boatraceRaceDate';
import type { BoatracePlaceId } from '../../utility/raceId';

/**
 * Repository層のRecord ボートレースのレース開催場所データ
 */
export class BoatracePlaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - ボートレースのグレード
     * @param updateDate - 更新日時
     */
    constructor(
        public readonly id: BoatracePlaceId,
        public readonly dateTime: BoatraceRaceDate,
        public readonly location: BoatraceRaceCourse,
        public readonly grade: BoatraceGradeType,
        public readonly updateDate: Date,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<BoatracePlaceRecord> = {}): BoatracePlaceRecord {
        return new BoatracePlaceRecord(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * BoatracePlaceEntityに変換する
     * @returns
     */
    toEntity(): BoatracePlaceEntity {
        return new BoatracePlaceEntity(
            this.id,
            BoatracePlaceData.create(this.dateTime, this.location, this.grade),
            this.updateDate,
        );
    }
}
