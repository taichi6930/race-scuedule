import '../../utility/format';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceStage,
} from '../../utility/data/autorace';
import type { AutoraceRaceId } from '../../utility/raceId';
import { generateAutoraceRaceId } from '../../utility/raceId';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceEntity {
    /**
     * ID
     */
    public readonly id: AutoraceRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     */
    constructor(
        id: AutoraceRaceId | null,
        public readonly name: string, // レース名
        public readonly stage: AutoraceRaceStage, // 開催ステージ
        public readonly dateTime: Date, // 開催日時
        public readonly location: AutoraceRaceCourse, // オートレース場名
        public readonly grade: AutoraceGradeType, // グレード
        public readonly number: number, // レース番号
    ) {
        this.id = id ?? generateAutoraceRaceId(dateTime, location, number);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoraceRaceEntity> = {}): AutoraceRaceEntity {
        return new AutoraceRaceEntity(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }

    /**
     * ドメインデータに変換する
     * @param partial
     * @returns
     */
    toDomainData(partial: Partial<AutoraceRaceEntity> = {}): AutoraceRaceData {
        return new AutoraceRaceData(
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
