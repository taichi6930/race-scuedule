import { z } from 'zod';

/**
 * JraHeldTimesのzod型定義
 */
const JraHeldTimesSchema = z
    .number()
    .int()
    .min(1, '開催回数は1以上である必要があります');

/**
 * JraHeldTimesの型定義
 */
export type JraHeldTimes = z.infer<typeof JraHeldTimesSchema>;

/**
 * 中央競馬のレース番号をバリデーションする
 * @param number - レース番号
 * @returns - バリデーション済みのレース番号
 */
export const validateJraHeldTimes = (
    number: number | undefined,
): JraHeldTimes => {
    if (number === undefined) {
        throw new Error('開催回数がundefinedです');
    }
    const result = JraHeldTimesSchema.safeParse(number);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${number.toString()}`);
    }
    return result.data;
};
