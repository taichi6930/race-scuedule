import type { z } from 'zod';

import {
    BaseRaceCourseSchema,
    validateBaseRaceCourse,
} from '../base/baseRaceCourse';

/**
 * オートレース場リスト
 */
const AutoraceRaceCourseList: string[] = [
    '船橋',
    '川口',
    '伊勢崎',
    '浜松',
    '飯塚',
    '山陽',
];

/**
 * オートレースのレース場名とコードの対応表
 */
export const AutoracePlaceCodeMap: Record<string, string> = {
    船橋: '01',
    川口: '02',
    伊勢崎: '03',
    浜松: '04',
    飯塚: '05',
    山陽: '06',
};

/**
 * オートレース場のzod型定義
 */
export const AutoraceRaceCourseSchema = BaseRaceCourseSchema(
    AutoraceRaceCourseList,
    'オートレース場',
);

/**
 * AutoraceRaceCourseの型定義
 */
export type AutoraceRaceCourse = z.infer<typeof AutoraceRaceCourseSchema>;

/**
 * 開催オートレース場のバリデーション
 */
export const validateAutoraceRaceCourse = (
    course: string,
): AutoraceRaceCourse =>
    validateBaseRaceCourse(course, AutoraceRaceCourseSchema);
