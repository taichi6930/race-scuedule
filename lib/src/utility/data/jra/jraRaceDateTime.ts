import { z } from 'zod';

/**
 * JraRaceDateTimeのzod型定義
 */
const JraRaceDateTimeSchema = z.date();

/**
 * JraRaceDateTimeの型定義
 */
export type JraRaceDateTime = z.infer<typeof JraRaceDateTimeSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateJraRaceDateTime = (
    dateTime: string | Date | undefined,
): JraRaceDateTime => {
    // undefinedの場合はエラー
    if (dateTime === undefined) {
        throw new Error('開催日時がundefinedです');
    }
    if (typeof dateTime === 'string') {
        dateTime = new Date(dateTime);
    }
    const result = JraRaceDateTimeSchema.safeParse(dateTime);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
