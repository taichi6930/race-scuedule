import { z } from 'zod';

/**
 * JraRaceDateTimeのzod型定義
 */
export const JraRaceDateTimeSchema = z.date();

/**
 * JraRaceDateTimeの型定義
 */
export type JraRaceDateTime = z.infer<typeof JraRaceDateTimeSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateJraRaceDateTime = (dateTime: unknown): JraRaceDateTime => {
    const result = JraRaceDateTimeSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
