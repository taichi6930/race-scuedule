import { z } from 'zod';

/**
 * AutoraceRaceNumberのzod型定義
 * 1~12の整数
 */
const AutoraceRaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');

/**
 * AutoraceRaceNumberの型定義
 */
export type AutoraceRaceNumber = z.infer<typeof AutoraceRaceNumberSchema>;

/**
 * オートレースのレース番号をバリデーションする
 * @param number - レース番号
 * @returns - バリデーション済みのレース番号
 */
export const validateAutoraceRaceNumber = (
    number: number,
): AutoraceRaceNumber => {
    const result = AutoraceRaceNumberSchema.safeParse(number);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${number.toString()}`);
    }
    return result.data;
};
