import { z } from 'zod';

/**
 * KeirinPositionNumberのzod型定義
 */

/**
 * KeirinPositionNumberのzod型定義
 */
const KeirinPositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(9, '枠番は9以下である必要があります');

/**
 * KeirinPositionNumberの型定義
 * 1~8の整数
 */
export type KeirinPositionNumber = z.infer<typeof KeirinPositionNumberSchema>;

/**
 * 競輪の枠番のバリデーション
 */
export const validateKeirinPositionNumber = (
    positionNumber: number,
): KeirinPositionNumber => {
    const result = KeirinPositionNumberSchema.safeParse(positionNumber);
    if (!result.success) {
        throw new Error(
            `${result.error.message}: ${positionNumber.toString()}`,
        );
    }
    return result.data;
};
