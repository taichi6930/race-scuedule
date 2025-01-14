import { z } from 'zod';

/**
 * ボートレースの選手リスト
 */
export const BoatracePlayerList = [
    {
        playerNumber: 4320,
        name: '峰竜太',
        priority: 6,
    },
];

/**
 * BoatracePlayerNumberのzod型定義
 */
export const BoatracePlayerNumberSchema = z
    .number()
    .int()
    .min(1, '選手番号は1以上である必要があります');

/**
 * BoatracePlayerNumberの型定義
 */
export type BoatracePlayerNumber = z.infer<typeof BoatracePlayerNumberSchema>;

/**
 * ボートレースの選手番号のバリデーション
 */
export const validateBoatracePlayerNumber = (
    playerNumber: number,
): BoatracePlayerNumber => {
    const result = BoatracePlayerNumberSchema.safeParse(playerNumber);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
