import { z } from 'zod';

/**
 * BaseRaceCourseのzod型定義
 */
export const BaseRaceCourseSchema = (
    raceCourseList: string[],
    raceType: string,
): z.ZodType =>
    z.string().refine((value) => {
        return raceCourseList.includes(value);
    }, `${raceType}ではありません`);

/**
 * 開催場のバリデーション
 */
export const validateBaseRaceCourse = <T extends string>(
    course: T,
    raceCourseSchema: z.ZodType,
): T => {
    const result = raceCourseSchema.safeParse(course);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${course}`);
    }
    return result.data as T;
};
