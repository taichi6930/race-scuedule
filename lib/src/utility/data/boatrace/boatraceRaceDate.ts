import { z } from 'zod';

/**
 * BoatraceRaceDateのzod型定義
 */
export const BoatraceRaceDateSchema = z.date();

/**
 * BoatraceRaceDateの型定義
 */
export type BoatraceRaceDate = z.infer<typeof BoatraceRaceDateSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateBoatraceRaceDate = (
    dateTime: unknown,
): BoatraceRaceDate => {
    const result = BoatraceRaceDateSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
