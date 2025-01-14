import { z } from 'zod';

/**
 * WorldRaceDistanceのzod型定義
 */
export const WorldRaceDistanceSchema = z
    .number()
    .positive('距離は0よりも大きい必要があります');

/**
 * WorldRaceDistanceの型定義
 */
export type WorldRaceDistance = z.infer<typeof WorldRaceDistanceSchema>;

/**
 * 海外競馬の距離をバリデーションする
 */
export const validateWorldRaceDistance = (
    distance: number,
): WorldRaceDistance => {
    const result = WorldRaceDistanceSchema.safeParse(distance);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
