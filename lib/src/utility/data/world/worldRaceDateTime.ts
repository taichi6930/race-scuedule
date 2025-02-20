import { z } from 'zod';

/**
 * WorldRaceDateTimeのzod型定義
 */
const WorldRaceDateTimeSchema = z.date();

/**
 * WorldRaceDateTimeの型定義
 */
export type WorldRaceDateTime = z.infer<typeof WorldRaceDateTimeSchema>;

/**
 * 開催日時のバリデーション
 * @param dateTime - 開催日時
 * @returns - バリデーション済みの開催日時
 */
export const validateWorldRaceDateTime = (dateTime: Date): WorldRaceDateTime =>
    WorldRaceDateTimeSchema.parse(dateTime);
