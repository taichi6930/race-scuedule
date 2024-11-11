import '../../utility/format';

import { format } from 'date-fns';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { AUTORACE_PLACE_CODE } from '../../utility/data/autorace';
import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceStage,
} from '../../utility/data/raceSpecific';

/**
 * 競輪のレース開催データ
 */
export class AutoraceRaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     */
    constructor(
        id: string | null,
        public readonly name: string, // レース名
        public readonly stage: AutoraceRaceStage, // 開催ステージ
        public readonly dateTime: Date, // 開催日時
        public readonly location: AutoraceRaceCourse, // 競馬場名
        public readonly grade: AutoraceGradeType, // グレード
        public readonly number: number, // レース番号
    ) {
        this.id = id ?? this.generateId(dateTime, location, number);
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

    /**
     * IDを生成する
     *
     * @private
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param number - レース番号
     * @returns 生成されたID
     */
    private generateId(
        dateTime: Date,
        location: AutoraceRaceCourse,
        number: number,
    ): string {
        return `autorace${format(dateTime, 'yyyyMMdd')}${AUTORACE_PLACE_CODE[location]}${number.toXDigits(2)}`;
    }
}
