import { z } from 'zod';

/**
 * JraRaceDistanceのzod型定義
 */
const JraRaceDistanceSchema = z
    .number()
    .positive('距離は0よりも大きい必要があります');

/**
 * JraRaceDistanceの型定義
 */
export type JraRaceDistance = z.infer<typeof JraRaceDistanceSchema>;

/**
 * 中央競馬の距離をバリデーションする
 */
export const validateJraRaceDistance = (distance: number): JraRaceDistance => {
    const result = JraRaceDistanceSchema.safeParse(distance);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${distance.toString()}`);
    }
    return result.data;
};
