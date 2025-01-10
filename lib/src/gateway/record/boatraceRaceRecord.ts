import '../../utility/format';

import type {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceNumber,
    BoatraceRaceStage,
} from '../../utility/data/boatrace';
import type { BoatraceRaceId } from '../../utility/raceId';

/**
 * ボートレースのレース開催データ
 */
export class BoatraceRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催データを生成する
     * @param id - ID
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     * @param updateDate - 更新日時
     *
     */
    constructor(
        public readonly id: BoatraceRaceId,
        public readonly name: string,
        public readonly stage: BoatraceRaceStage,
        public readonly dateTime: Date,
        public readonly location: BoatraceRaceCourse,
        public readonly grade: BoatraceGradeType,
        public readonly number: BoatraceRaceNumber,
        public readonly updateDate: Date,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<BoatraceRaceRecord> = {}): BoatraceRaceRecord {
        return new BoatraceRaceRecord(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.updateDate ?? this.updateDate,
        );
    }
}
