import type { AutoracePlaceData } from '../../domain/autoracePlaceData';
import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
} from '../../utility/data/autorace';
import {
    type AutoracePlaceId,
    generateAutoracePlaceId,
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
     */
    constructor(
        public readonly id: AutoracePlaceId,
        public readonly dateTime: Date,
        public readonly location: AutoraceRaceCourse,
        public readonly grade: AutoraceGradeType,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoracePlaceRecord> = {}): AutoracePlaceRecord {
        return new AutoracePlaceRecord(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }

    /**
     * DomainDataからRecordへの変換
     * @param domainData
     * @returns
     */
    static fromDomainData(domainData: AutoracePlaceData): AutoracePlaceRecord {
        return new AutoracePlaceRecord(
            generateAutoracePlaceId(domainData.dateTime, domainData.location),
            domainData.dateTime,
            domainData.location,
            domainData.grade,
        );
    }
}
