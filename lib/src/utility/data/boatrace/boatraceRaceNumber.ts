import { z } from 'zod';

/**
 * BoatraceRaceNumberのzod型定義
 * 1~12の整数
 */
const BoatraceRaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');

/**
 * BoatraceRaceNumberの型定義
 */
export type BoatraceRaceNumber = z.infer<typeof BoatraceRaceNumberSchema>;

/**
 * ボートレースのレース番号をバリデーションする
 * @param number - レース番号
 * @returns - バリデーション済みのレース番号
 */
export const validateBoatraceRaceNumber = (
    number: number,
): BoatraceRaceNumber => {
    const result = BoatraceRaceNumberSchema.safeParse(number);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
