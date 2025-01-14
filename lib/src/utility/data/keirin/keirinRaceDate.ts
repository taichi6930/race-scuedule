import { z } from 'zod';

/**
 * KeirinRaceDateのzod型定義
 */
export const KeirinRaceDateSchema = z.date();

/**
 * KeirinRaceDateの型定義
 */
export type KeirinRaceDate = z.infer<typeof KeirinRaceDateSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateKeirinRaceDate = (dateTime: unknown): KeirinRaceDate => {
    const result = KeirinRaceDateSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
