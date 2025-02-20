import { z } from 'zod';

/**
 * NarRaceNumberのzod型定義
 * 1~12の整数
 */
const NarRaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');

/**
 * NarRaceNumberの型定義
 */
export type NarRaceNumber = z.infer<typeof NarRaceNumberSchema>;

/**
 * 地方競馬のレース番号をバリデーションする
 * @param number - レース番号
 * @returns - バリデーション済みのレース番号
 */
export const validateNarRaceNumber = (number: number): NarRaceNumber =>
    NarRaceNumberSchema.parse(number);
