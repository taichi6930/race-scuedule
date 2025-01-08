import { z } from 'zod';

/**
 * JraRaceCourseのzod型定義
 */
export const JraRaceCourseSchema = z.string().refine((value) => {
    return JraRaceCourseList.includes(value);
}, 'Jraの競馬場ではありません');

/**
 * JraRaceCourseの型定義
 */
export type JraRaceCourse = z.infer<typeof JraRaceCourseSchema>;

/**
 * JRAの競馬場 リスト
 */
export const JraRaceCourseList: string[] = [
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
 * JRAの馬場種別
 */
export type JraRaceCourseType = '芝' | 'ダート' | '障害';

/**
 * JRAのグレード
 */
export type JraGradeType =
    | 'GⅠ'
    | 'GⅡ'
    | 'GⅢ'
    | 'J.GⅠ'
    | 'J.GⅡ'
    | 'J.GⅢ'
    | 'JpnⅠ'
    | 'JpnⅡ'
    | 'JpnⅢ'
    | '重賞'
    | 'Listed'
    | 'オープン特別'
    | '格付けなし'
    | 'オープン'
    | '3勝クラス'
    | '2勝クラス'
    | '1勝クラス'
    | '1600万下'
    | '1000万下'
    | '900万下'
    | '500万下'
    | '未勝利'
    | '未出走'
    | '新馬';

/**
 * JRAの指定グレードリスト
 */
export const JRA_SPECIFIED_GRADE_LIST: JraGradeType[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'J.GⅠ',
    'J.GⅡ',
    'J.GⅢ',
    'JpnⅠ',
    'JpnⅡ',
    'JpnⅢ',
    '重賞',
    'Listed',
    'オープン特別',
];
