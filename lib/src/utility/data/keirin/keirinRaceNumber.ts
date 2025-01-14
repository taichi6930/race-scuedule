import { z } from 'zod';

/**
 * KeirinRaceNumberのzod型定義
 * 1~12の整数
 */
export const KeirinRaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');

/**
 * KeirinRaceNumberの型定義
 */
export type KeirinRaceNumber = z.infer<typeof KeirinRaceNumberSchema>;

/**
 * 競輪のレース番号をバリデーションする
 * @param number - レース番号
 * @returns - バリデーション済みのレース番号
 */
export const validateKeirinRaceNumber = (number: number): KeirinRaceNumber => {
    const result = KeirinRaceNumberSchema.safeParse(number);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
