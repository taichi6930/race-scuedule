import { z } from 'zod';

/**
 * AutoraceRaceNameのzod型定義
 */
export const AutoraceRaceNameSchema = z.string();

/**
 * AutoraceRaceNameの型定義
 */
export type AutoraceRaceName = z.infer<typeof AutoraceRaceNameSchema>;

/**
 * オートレースのレース名のバリデーション
 * @param name - オートレースのレース名
 * @returns - バリデーション済みのオートレースのレース名
 */
export const validateAutoraceRaceName = (name: string): AutoraceRaceName => {
    const result = AutoraceRaceNameSchema.safeParse(name);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
