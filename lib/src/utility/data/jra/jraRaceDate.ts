import { z } from 'zod';

/**
 * JraRaceDateのzod型定義
 */
const JraRaceDateSchema = z.date();

/**
 * JraRaceDateの型定義
 */
export type JraRaceDate = z.infer<typeof JraRaceDateSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateJraRaceDate = (dateTime: unknown): JraRaceDate => {
    const result = JraRaceDateSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
