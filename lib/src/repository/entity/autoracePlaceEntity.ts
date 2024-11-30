import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
} from '../../utility/data/autorace';
import type { AutoracePlaceId } from '../../utility/raceId';
import { generateAutoracePlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity オートレースのレース開催場所データ
 */
export class AutoracePlaceEntity {
    /**
     * ID
     */
    public readonly id: AutoracePlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - オートレースのグレード
     */
    constructor(
        id: AutoracePlaceId | null,
        public readonly dateTime: Date,
        public readonly location: AutoraceRaceCourse,
        public readonly grade: AutoraceGradeType,
    ) {
        this.id = id ?? generateAutoracePlaceId(dateTime, location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoracePlaceEntity> = {}): AutoracePlaceEntity {
        return new AutoracePlaceEntity(
            partial.id ?? null,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }

    /**
     * データ型に変換する
     * @param partial
     * @returns
     */
    toDomainData(
        partial: Partial<AutoracePlaceEntity> = {},
    ): AutoracePlaceData {
        return new AutoracePlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
