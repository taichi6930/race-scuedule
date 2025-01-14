import '../../utility/format';

import type { AutoraceGradeType } from '../../utility/data/autorace/autoraceGradeType';
import type { AutoraceRaceCourse } from '../../utility/data/autorace/autoraceRaceCourse';
import type { AutoraceRaceDateTime } from '../../utility/data/autorace/autoraceRaceDateTime';
import type { AutoraceRaceName } from '../../utility/data/autorace/autoraceRaceName';
import type { AutoraceRaceNumber } from '../../utility/data/autorace/autoraceRaceNumber';
import type { AutoraceRaceStage } from '../../utility/data/autorace/autoraceRaceStage';
import type { AutoraceRaceId } from '../../utility/raceId';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
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
        public readonly id: AutoraceRaceId,
        public readonly name: AutoraceRaceName,
        public readonly stage: AutoraceRaceStage,
        public readonly dateTime: AutoraceRaceDateTime,
        public readonly location: AutoraceRaceCourse,
        public readonly grade: AutoraceGradeType,
        public readonly number: AutoraceRaceNumber,
        public readonly updateDate: Date,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoraceRaceRecord> = {}): AutoraceRaceRecord {
        return new AutoraceRaceRecord(
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
