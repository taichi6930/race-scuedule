import { z } from 'zod';

/**
 * NarRaceDateTimeのzod型定義
 */
const NarRaceDateTimeSchema = z.date();

/**
 * NarRaceDateTimeの型定義
 */
export type NarRaceDateTime = z.infer<typeof NarRaceDateTimeSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateNarRaceDateTime = (
    dateTime: string | Date | undefined,
): NarRaceDateTime => {
    if (dateTime === undefined) {
        throw new Error('dateTime is undefined');
    }
    if (typeof dateTime === 'string') {
        dateTime = new Date(dateTime);
    }
    const result = NarRaceDateTimeSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
