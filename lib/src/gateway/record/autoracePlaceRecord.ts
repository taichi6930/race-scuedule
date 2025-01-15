import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import {
    type AutoraceGradeType,
    validateAutoraceGradeType,
} from '../../utility/data/autorace/autoraceGradeType';
import {
    type AutoraceRaceCourse,
    validateAutoraceRaceCourse,
} from '../../utility/data/autorace/autoraceRaceCourse';
import {
    type AutoraceRaceDate,
    validateAutoraceRaceDate,
} from '../../utility/data/autorace/autoraceRaceDate';
import {
    type AutoracePlaceId,
    validateAutoracePlaceId,
} from '../../utility/raceId';

/**
 * Repository層のRecord オートレースのレース開催場所データ
 */
export class AutoracePlaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - オートレースのグレード
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: AutoracePlaceId,
        public readonly dateTime: AutoraceRaceDate,
        public readonly location: AutoraceRaceCourse,
        public readonly grade: AutoraceGradeType,
        public readonly updateDate: Date,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - オートレースのグレード
     * @param updateDate - 更新日時
     */
    static create(
        id: AutoracePlaceId,
        dateTime: Date,
        location: string,
        grade: string,
        updateDate: Date,
    ): AutoracePlaceRecord {
        try {
            return new AutoracePlaceRecord(
                validateAutoracePlaceId(id),
                validateAutoraceRaceDate(dateTime),
                validateAutoraceRaceCourse(location),
                validateAutoraceGradeType(grade),
                updateDate,
            );
        } catch (e) {
            throw new Error(
                `Failed to create AutoracePlaceRecord: ${(e as Error).message}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoracePlaceRecord> = {}): AutoracePlaceRecord {
        return AutoracePlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoracePlaceEntityに変換する
     * @returns
     */
    toEntity(): AutoracePlaceEntity {
        return new AutoracePlaceEntity(
            this.id,
            AutoracePlaceData.create(this.dateTime, this.location, this.grade),
            this.updateDate,
        );
    }
}
