import { z } from 'zod';

/**
 * AutoraceRaceCourseのzod型定義
 */
export const AutoraceRaceCourseSchema = z.string().refine((value) => {
    return AutoraceRaceCourseList.includes(value);
}, 'オートレース場ではありません');

/**
 * AutoraceRaceCourseの型定義
 */
export type AutoraceRaceCourse = z.infer<typeof AutoraceRaceCourseSchema>;

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
 * 開催オートレース場のバリデーション
 */
export const validateAutoraceRaceCourse = (
    course: string,
): AutoraceRaceCourse => {
    const result = AutoraceRaceCourseSchema.safeParse(course);
    if (!result.success) {
        throw new Error('オートレース場が不正です');
    }
    return result.data;
};
