import { z } from 'zod';

/**
 * WorldRaceNameのzod型定義
 */
const WorldRaceNameSchema = z.string().min(1, '空文字は許可されていません');

/**
 * WorldRaceNameの型定義
 */
export type WorldRaceName = z.infer<typeof WorldRaceNameSchema>;

/**
 * 海外競馬のレース名のバリデーション
 * @param name - 海外競馬のレース名
 * @returns - バリデーション済みの海外競馬のレース名
 */
export const validateWorldRaceName = (name: string): WorldRaceName =>
    WorldRaceNameSchema.parse(name);
