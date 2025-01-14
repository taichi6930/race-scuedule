import '../../utility/format';

import type { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import type { KeirinRaceCourse } from '../../utility/data/keirin/keirinRaceCourse';
import type { KeirinRaceNumber } from '../../utility/data/keirin/keirinRaceNumber';
import type { KeirinRaceStage } from '../../utility/data/keirin/keirinRaceStage';
import type { KeirinRaceId } from '../../utility/raceId';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
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
        public readonly id: KeirinRaceId,
        public readonly name: string,
        public readonly stage: KeirinRaceStage,
        public readonly dateTime: Date,
        public readonly location: KeirinRaceCourse,
        public readonly grade: KeirinGradeType,
        public readonly number: KeirinRaceNumber,
        public readonly updateDate: Date,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinRaceRecord> = {}): KeirinRaceRecord {
        return new KeirinRaceRecord(
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
