import { z } from 'zod';

/**
 * JraRaceCourseのzod型定義
 */
export const JraRaceCourseSchema = z.string().refine((value) => {
    return JraRaceCourseList.includes(value);
}, '中央の競馬場ではありません');

/**
 * JraRaceCourseの型定義
 */
export type JraRaceCourse = z.infer<typeof JraRaceCourseSchema>;

/**
 * JRAの競馬場 リスト
 */
const JraRaceCourseList: string[] = [
    '札幌',
    '函館',
    '福島',
    '新潟',
    '東京',
    '中山',
    '中京',
    '京都',
    '阪神',
    '小倉',
];

/**
 * 開催中央競馬場のバリデーション
 */
export const validateJraRaceCourse = (
    course: string | undefined,
): JraRaceCourse => {
    if (course === undefined) {
        throw new Error('中央競馬の競馬場がundefinedです');
    }
    const result = JraRaceCourseSchema.safeParse(course);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${course}`);
    }
    return result.data;
};
