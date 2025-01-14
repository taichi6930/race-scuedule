import { z } from 'zod';

/**
 * KeirinRaceNameのzod型定義
 */
export const KeirinRaceNameSchema = z
    .string()
    .min(1, '空文字は許可されていません');

/**
 * KeirinRaceNameの型定義
 */
export type KeirinRaceName = z.infer<typeof KeirinRaceNameSchema>;

/**
 * 競輪のレース名のバリデーション
 * @param name - 競輪のレース名
 * @returns - バリデーション済みの競輪のレース名
 */
export const validateKeirinRaceName = (name: string): KeirinRaceName => {
    const result = KeirinRaceNameSchema.safeParse(name);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
