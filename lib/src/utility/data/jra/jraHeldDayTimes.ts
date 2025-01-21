import { z } from 'zod';

/**
 * JraHeldDayTimesのzod型定義
 */
const JraHeldDayTimesSchema = z
    .number()
    .int()
    .min(1, '開催日数は1以上である必要があります');

/**
 * JraHeldDayTimesの型定義
 */
export type JraHeldDayTimes = z.infer<typeof JraHeldDayTimesSchema>;

/**
 * 中央競馬のレース番号をバリデーションする
 * @param number - レース番号
 * @returns - バリデーション済みのレース番号
 */
export const validateJraHeldDayTimes = (number: number): JraHeldDayTimes => {
    const result = JraHeldDayTimesSchema.safeParse(number);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${number.toString()}`);
    }
    return result.data;
};
