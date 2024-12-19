import '../../utility/format';

import { NarRaceData } from '../../domain/narRaceData';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import type {
    NarGradeType,
    NarRaceCourse,
    NarRaceCourseType,
} from '../../utility/data/nar';
import type { NarRaceId } from '../../utility/raceId';

/**
 * 地方競馬のレース開催データ
 */
export class NarRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 地方競馬のレース開催データを生成する
     * @param id - ID
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @param updateDate - 更新日時
     *
     */
    constructor(
        public readonly id: NarRaceId,
        public readonly name: string,
        public readonly dateTime: Date,
        public readonly location: NarRaceCourse,
        public readonly surfaceType: NarRaceCourseType,
        public readonly distance: number,
        public readonly grade: NarGradeType,
        public readonly number: number,
        public readonly updateDate: Date,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarRaceRecord> = {}): NarRaceRecord {
        return new NarRaceRecord(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * NarRaceEntityに変換する
     * @returns
     */
    toEntity(): NarRaceEntity {
        return new NarRaceEntity(
            this.id,
            new NarRaceData(
                this.name,
                this.dateTime,
                this.location,
                this.surfaceType,
                this.distance,
                this.grade,
                this.number,
            ),
            this.updateDate,
        );
    }
}
