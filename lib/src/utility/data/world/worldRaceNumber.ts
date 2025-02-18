import { z } from 'zod';

/**
 * WorldRaceNumberのzod型定義
 *
 * 0以上の整数
 */
const WorldRaceNumberSchema = z.number().int().positive();

/**
 * WorldRaceNumberの型定義
 */
export type WorldRaceNumber = z.infer<typeof WorldRaceNumberSchema>;

/**
 * 海外競馬のレース番号をバリデーションする
 * @param {number} number - レース番号
 * @returns {WorldRaceNumber} - バリデーション済みのレース番号
 */
export const validateWorldRaceNumber = (number: number): WorldRaceNumber =>
    WorldRaceNumberSchema.parse(number);
