import { z } from 'zod';

/**
 * AutoraceRaceDateTimeのzod型定義
 */
const AutoraceRaceDateTimeSchema = z.date();

/**
 * AutoraceRaceDateTimeの型定義
 */
export type AutoraceRaceDateTime = z.infer<typeof AutoraceRaceDateTimeSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateAutoraceRaceDateTime = (
    dateTime: unknown,
): AutoraceRaceDateTime => {
    const result = AutoraceRaceDateTimeSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
