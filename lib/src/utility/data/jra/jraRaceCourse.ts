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
export const validateJraRaceCourse = (course: string): JraRaceCourse => {
    const result = JraRaceCourseSchema.safeParse(course);
    if (!result.success) {
        console.error(`中央競馬場名が不正です: ${course}`);
        throw new Error(result.error.message);
    }
    return result.data;
};
