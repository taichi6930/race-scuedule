import { format } from 'date-fns';

import { NETKEIBA_BABACODE } from '../../utility/data/netkeiba';
import type {
    NarGradeType,
    NarRaceCourse,
} from '../../utility/data/raceSpecific';

/**
 * 競輪のレース開催データ
 */
export class NarRaceEntity {
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
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     */
    constructor(
        id: string | null,
        public readonly name: string, // レース名
        public readonly dateTime: Date, // 開催日時
        public readonly location: NarRaceCourse, // 競馬場名
        public readonly surfaceType: NarRaceCourse, // 馬場種別
        public readonly distance: number, // 距離
        public readonly grade: NarGradeType, // グレード
        public readonly number: number, // レース番号
    ) {
        this.id = id ?? this.generateId(dateTime, location, number);
        const [isValid, errorMessageList] = this.validate();
        if (!isValid) {
            throw new Error(errorMessageList.join('\n'));
        }
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
        location: NarRaceCourse,
        number: number,
    ): string {
        return `nar${format(dateTime, 'yyyyMMdd')}${NETKEIBA_BABACODE[location]}${number.toXDigits(2)}`;
    }

    /**
     * バリデーション
     * 型ではない部分でのバリデーションを行う
     *
     * @returns バリデーション結果
     */
    private validate(): [boolean, string[]] {
        // エラー文をまとめて表示する
        const errorMessageList: string[] = [];

        // 距離は0より大きい
        if (this.distance <= 0) {
            errorMessageList.push('距離は0より大きい必要があります');
        }
        // レース番号は1以上12以下
        if (this.number < 1 || this.number > 12) {
            errorMessageList.push(
                'レース番号は1以上12以下である必要があります',
            );
        }
        return [errorMessageList.length === 0, errorMessageList];
    }
}
