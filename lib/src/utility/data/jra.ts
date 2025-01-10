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
 * JraRaceCourseTypeのzod型定義
 */
export const JraRaceCourseTypeSchema = z.string().refine((value) => {
    return JraRaceCourseTypeList.includes(value);
}, 'JRAの馬場種別ではありません');

/**
 * JraRaceCourseTypeの型定義
 */
export type JraRaceCourseType = z.infer<typeof JraRaceCourseTypeSchema>;

/**
 * JRAの競馬の馬場種別 リスト
 */
export const JraRaceCourseTypeList: string[] = ['芝', 'ダート', '障害'];

/**
 * JraGradeTypeのzod型定義
 */
export const JraGradeTypeSchema = z.string().refine((value) => {
    return JraGradeTypeList.includes(value);
}, 'JRAのグレードではありません');

/**
 * JraGradeTypeの型定義
 */
export type JraGradeType = z.infer<typeof JraGradeTypeSchema>;

/**
 * JRAのグレード リスト
 */
export const JraGradeTypeList: string[] = [
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
    '格付けなし',
    'オープン',
    '3勝クラス',
    '2勝クラス',
    '1勝クラス',
    '1600万下',
    '1000万下',
    '900万下',
    '500万下',
    '未勝利',
    '未出走',
    '新馬',
];

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

/**
 * JraRaceDistanceのzod型定義
 */
export const JraRaceDistanceSchema = z
    .number()
    .positive('距離は0よりも大きい必要があります');

/**
 * JraRaceDistanceの型定義
 */
export type JraRaceDistance = z.infer<typeof JraRaceDistanceSchema>;

/**
 * JraRaceNumberのzod型定義
 * 1~12の整数
 */
export const JraRaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');

/**
 * JraRaceNumberの型定義
 */
export type JraRaceNumber = z.infer<typeof JraRaceNumberSchema>;

/**
 * JraHeldTimesのzod型定義
 */
export const JraHeldTimesSchema = z
    .number()
    .int()
    .min(1, '開催回数は1以上である必要があります');

/**
 * JraHeldTimesの型定義
 */
export type JraHeldTimes = z.infer<typeof JraHeldTimesSchema>;

/**
 * JraHeldDayTimesのzod型定義
 */
export const JraHeldDayTimesSchema = z
    .number()
    .int()
    .min(1, '開催日数は1以上である必要があります');

/**
 * JraHeldDayTimesの型定義
 */
export type JraHeldDayTimes = z.infer<typeof JraHeldDayTimesSchema>;
