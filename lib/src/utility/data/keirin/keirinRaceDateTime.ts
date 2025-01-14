import { z } from 'zod';

/**
 * KeirinRaceDateTimeのzod型定義
 */
export const KeirinRaceDateTimeSchema = z.date();

/**
 * KeirinRaceDateTimeの型定義
 */
export type KeirinRaceDateTime = z.infer<typeof KeirinRaceDateTimeSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateKeirinRaceDateTime = (
    dateTime: unknown,
): KeirinRaceDateTime => {
    const result = KeirinRaceDateTimeSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
