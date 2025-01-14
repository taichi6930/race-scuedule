import { z } from 'zod';

/**
 * WorldRaceDateのzod型定義
 */
const WorldRaceDateSchema = z.date();

/**
 * WorldRaceDateの型定義
 */
export type WorldRaceDate = z.infer<typeof WorldRaceDateSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateWorldRaceDate = (dateTime: unknown): WorldRaceDate => {
    const result = WorldRaceDateSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
