import { z } from 'zod';

/**
 * AutoraceRaceNameのzod型定義
 */
const AutoraceRaceNameSchema = z.string().min(1, '空文字は許可されていません');

/**
 * AutoraceRaceNameの型定義
 */
export type AutoraceRaceName = z.infer<typeof AutoraceRaceNameSchema>;

/**
 * オートレースのレース名のバリデーション
 * @param name - オートレースのレース名
 * @returns - バリデーション済みのオートレースのレース名
 */
export const validateAutoraceRaceName = (name: string): AutoraceRaceName =>
    AutoraceRaceNameSchema.parse(name);
