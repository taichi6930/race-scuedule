import { z } from 'zod';

/**
 * JraRaceNameのzod型定義
 */
const JraRaceNameSchema = z.string().min(1, '空文字は許可されていません');

/**
 * JraRaceNameの型定義
 */
export type JraRaceName = z.infer<typeof JraRaceNameSchema>;

/**
 * 中央競馬のレース名のバリデーション
 * @param name - 中央競馬のレース名
 * @returns - バリデーション済みの中央競馬のレース名
 */
export const validateJraRaceName = (name: string): JraRaceName => {
    const result = JraRaceNameSchema.safeParse(name);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${name}`);
    }
    return result.data;
};
