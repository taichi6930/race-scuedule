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
export const AutoraceGradeTypeList: string[] = [
    'SG',
    '特GⅠ',
    'GⅠ',
    'GⅡ',
    '開催',
];

/**
 * オートレースの指定グレードリスト
 */
export const AUTORACE_SPECIFIED_GRADE_LIST: AutoraceGradeType[] = ['SG'];

/**
 * AutoraceRaceStageのzod型定義
 */
export const AutoraceRaceStageSchema = z.string().refine((value) => {
    return AutoraceRaceStageList.includes(value);
}, 'オートレースのステージではありません');

/**
 * AutoraceRaceStageの型定義
 */
export type AutoraceRaceStage = z.infer<typeof AutoraceRaceStageSchema>;

/**
 * ボートレースのステージ リスト
 */
export const AutoraceRaceStageList: string[] = [
    '優勝戦',
    '準決勝戦',
    '特別選抜戦',
    '特別一般戦',
    '一般戦',
    '予選',
    '選抜予選',
    '最終予選',
    'オーバル特別',
    '選抜戦',
];

/**
 * オートレースの指定グレード・ステージリスト
 */
export const AUTORACE_SPECIFIED_GRADE_AND_STAGE_LIST: {
    grade: AutoraceGradeType;
    stage: AutoraceRaceStage;
    priority: number;
}[] = [{ grade: 'SG', stage: '優勝戦', priority: 9 }];

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
export const AutoraceRaceCourseList: string[] = [
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
export const AUTORACE_PLACE_CODE: Record<string, string> = {
    船橋: '01',
    川口: '02',
    伊勢崎: '03',
    浜松: '04',
    飯塚: '05',
    山陽: '06',
};

/**
 * HTMLのステージ名を正式名称に変換するためのマップ
 */
export const AUTORACE_STAGE_MAP: Record<string, AutoraceRaceStage> = {
    優勝戦: '優勝戦',
    特別選抜戦: '特別選抜戦',
    選抜戦: '選抜戦',
    特別一般戦: '特別一般戦',
    Ｇレース７一般戦: '一般戦',
    一般戦: '一般戦',
    予選: '予選',
    選抜予選: '選抜予選',
    準決勝戦Ｂ: '準決勝戦',
    準決勝戦Ａ: '準決勝戦',
    準決勝戦: '準決勝戦',
    最終予選: '最終予選',
    特別一般戦Ａ: '特別一般戦',
    特別一般戦Ｂ: '特別一般戦',
};

/**
 * オートレースの選手リスト
 */
export const AutoracePlayerList = [
    {
        playerNumber: 5954,
        name: '青山周平',
        priority: 6,
    },
];
