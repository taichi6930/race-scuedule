import '../../utility/format';

import { format } from 'date-fns';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import type {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from '../../utility/data/keirin';
import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceEntity {
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
        public readonly stage: KeirinRaceStage, // 開催ステージ
        public readonly dateTime: Date, // 開催日時
        public readonly location: KeirinRaceCourse, // 競馬場名
        public readonly grade: KeirinGradeType, // グレード
        public readonly number: number, // レース番号
    ) {
        this.id = id ?? this.generateId(dateTime, location, number);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinRaceEntity> = {}): KeirinRaceEntity {
        return new KeirinRaceEntity(
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
    toDomainData(partial: Partial<KeirinRaceEntity> = {}): KeirinRaceData {
        return new KeirinRaceData(
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
        location: KeirinRaceCourse,
        number: number,
    ): string {
        return `keirin${format(dateTime, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[location]}${number.toXDigits(2)}`;
    }
}
