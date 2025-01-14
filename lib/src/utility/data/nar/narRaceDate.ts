import { z } from 'zod';

/**
 * NarRaceDateのzod型定義
 */
export const NarRaceDateSchema = z.date();

/**
 * NarRaceDateの型定義
 */
export type NarRaceDate = z.infer<typeof NarRaceDateSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateNarRaceDate = (dateTime: unknown): NarRaceDate => {
    const result = NarRaceDateSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
