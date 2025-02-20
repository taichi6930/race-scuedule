import { z } from 'zod';

/**
 * JraRaceNumberのzod型定義
 * 1~12の整数
 */
const JraRaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');

/**
 * JraRaceNumberの型定義
 */
export type JraRaceNumber = z.infer<typeof JraRaceNumberSchema>;

/**
 * 中央競馬のレース番号をバリデーションする
 * @param number - レース番号
 * @returns - バリデーション済みのレース番号
 */
export const validateJraRaceNumber = (number: number): JraRaceNumber =>
    JraRaceNumberSchema.parse(number);
