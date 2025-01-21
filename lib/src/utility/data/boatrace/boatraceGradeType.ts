import { z } from 'zod';

/**
 * BoatraceGradeTypeのzod型定義
 */
export const BoatraceGradeTypeSchema = z.string().refine((value) => {
    return BoatraceGradeTypeList.includes(value);
}, 'ボートレースのグレードではありません');

/**
 * BoatraceGradeTypeの型定義
 */
export type BoatraceGradeType = z.infer<typeof BoatraceGradeTypeSchema>;

/**
 * ボートレースのグレード リスト
 */
const BoatraceGradeTypeList: string[] = ['SG', 'GⅠ', 'GⅡ', 'GⅢ', '一般'];

/**
 * ボートレースのグレードのバリデーション
 * @param grade - ボートレースのグレード
 * @returns - バリデーション済みのボートレースのグレード
 */
export const validateBoatraceGradeType = (grade: string): BoatraceGradeType => {
    const result = BoatraceGradeTypeSchema.safeParse(grade);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${grade}`);
    }
    return result.data;
};

/**
 * ボートレースのグレード
 */
export const BoatraceSpecifiedGradeList: BoatraceGradeType[] = [
    'SG',
    'GⅠ',
    'GⅡ',
    'GⅢ',
];
