import { z } from 'zod';

/**
 * AutoraceGradeTypeのzod型定義
 */
export const AutoraceGradeTypeSchema = z.string().refine((value) => {
    return AutoraceGradeTypeList.includes(value);
}, 'オートレースのグレードではありません');

/**
 * AutoraceGradeTypeの型定義
 */
export type AutoraceGradeType = z.infer<typeof AutoraceGradeTypeSchema>;

/**
 * ボートレースのグレード リスト
 */
const AutoraceGradeTypeList: string[] = ['SG', '特GⅠ', 'GⅠ', 'GⅡ', '開催'];

/**
 * オートレースのグレードのバリデーション
 * @param grade - オートレースのグレード
 * @returns - バリデーション済みのオートレースのグレード
 */
export const validateAutoraceGradeType = (grade: string): AutoraceGradeType => {
    const result = AutoraceGradeTypeSchema.safeParse(grade);
    if (!result.success) {
        throw new Error(`${result.error.message}: ${grade}`);
    }
    return result.data;
};

/**
 * オートレースの指定グレードリスト
 */
export const AutoraceSpecifiedGradeList: AutoraceGradeType[] = ['SG'];
