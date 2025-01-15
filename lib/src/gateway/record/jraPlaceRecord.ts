import { JraPlaceData } from '../../domain/jraPlaceData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../../utility/data/jra/jraHeldDayTimes';
import {
    type JraHeldTimes,
    validateJraHeldTimes,
} from '../../utility/data/jra/jraHeldTimes';
import {
    type JraRaceCourse,
    validateJraRaceCourse,
} from '../../utility/data/jra/jraRaceCourse';
import {
    type JraRaceDate,
    validateJraRaceDate,
} from '../../utility/data/jra/jraRaceDate';
import { type JraPlaceId, validateJraPlaceId } from '../../utility/raceId';
/**
 * Repository層のRecord 中央競馬のレース開催場所データ
 */
export class JraPlaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 中央競馬のレース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: JraPlaceId,
        public readonly dateTime: JraRaceDate,
        public readonly location: JraRaceCourse,
        public readonly heldTimes: JraHeldTimes,
        public readonly heldDayTimes: JraHeldDayTimes,
        public readonly updateDate: Date,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param updateDate - 更新日時
     */
    static create(
        id: string,
        dateTime: Date,
        location: string,
        heldTimes: number,
        heldDayTimes: number,
        updateDate: Date,
    ): JraPlaceRecord {
        try {
            return new JraPlaceRecord(
                validateJraPlaceId(id),
                validateJraRaceDate(dateTime),
                validateJraRaceCourse(location),
                validateJraHeldTimes(heldTimes),
                validateJraHeldDayTimes(heldDayTimes),
                updateDate,
            );
        } catch (e) {
            throw new Error(
                `JraPlaceRecord create error: ${(e as Error).message}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<JraPlaceRecord> = {}): JraPlaceRecord {
        return JraPlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * JraPlaceEntityに変換する
     * @returns
     */
    toEntity(): JraPlaceEntity {
        return new JraPlaceEntity(
            this.id,
            JraPlaceData.create(
                this.dateTime,
                this.location,
                this.heldTimes,
                this.heldDayTimes,
            ),
            this.updateDate,
        );
    }
}
