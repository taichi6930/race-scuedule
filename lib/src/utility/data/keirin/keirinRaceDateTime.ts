import { z } from 'zod';

/**
 * KeirinRaceDateTimeのzod型定義
 */
const KeirinRaceDateTimeSchema = z.date();

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
    dateTime: Date,
): KeirinRaceDateTime => KeirinRaceDateTimeSchema.parse(dateTime);
