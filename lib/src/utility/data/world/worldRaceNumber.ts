import { z } from 'zod';

/**
 * WorldRaceNumberのzod型定義
 * 整数
 */
export const WorldRaceNumberSchema = z.number().int();
/**
 * WorldRaceNumberの型定義
 */
export type WorldRaceNumber = z.infer<typeof WorldRaceNumberSchema>;

/**
 * 海外競馬のレース番号をバリデーションする
 * @param number - レース番号
 * @returns - バリデーション済みのレース番号
 */
export const validateWorldRaceNumber = (number: number): WorldRaceNumber => {
    const result = WorldRaceNumberSchema.parse(number);
    return result;
};
