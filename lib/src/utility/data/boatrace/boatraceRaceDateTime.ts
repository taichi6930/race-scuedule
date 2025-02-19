import { z } from 'zod';

/**
 * BoatraceRaceDateTimeのzod型定義
 */
const BoatraceRaceDateTimeSchema = z.date();

/**
 * BoatraceRaceDateTimeの型定義
 */
export type BoatraceRaceDateTime = z.infer<typeof BoatraceRaceDateTimeSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateBoatraceRaceDateTime = (
    dateTime: Date,
): BoatraceRaceDateTime => BoatraceRaceDateTimeSchema.parse(dateTime);
