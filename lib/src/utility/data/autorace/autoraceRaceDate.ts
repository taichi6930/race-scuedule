import { z } from 'zod';

/**
 * AutoraceRaceDateのzod型定義
 */
export const AutoraceRaceDateSchema = z.date();

/**
 * AutoraceRaceDateの型定義
 */
export type AutoraceRaceDate = z.infer<typeof AutoraceRaceDateSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateAutoraceRaceDate = (
    dateTime: unknown,
): AutoraceRaceDate => {
    const result = AutoraceRaceDateSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
