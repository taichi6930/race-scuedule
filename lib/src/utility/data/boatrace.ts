import { z } from 'zod';

export const BOATRACE_PLACE_CODE: Record<string, string> = {
    桐生: '01',
    戸田: '02',
    江戸川: '03',
    平和島: '04',
    多摩川: '05',
    浜名湖: '06',
    蒲郡: '07',
    常滑: '08',
    津: '09',
    三国: '10',
    びわこ: '11',
    住之江: '12',
    尼崎: '13',
    鳴門: '14',
    丸亀: '15',
    児島: '16',
    宮島: '17',
    徳山: '18',
    下関: '19',
    若松: '20',
    芦屋: '21',
    福岡: '22',
    唐津: '23',
    大村: '24',
};

/**
 * BoatraceRaceCourseのzod型定義
 */
export const BoatraceRaceCourseSchema = z.string().refine((value) => {
    return BoatraceRaceCourseList.includes(value);
}, 'ボートレース場ではありません');

/**
 * BoatraceRaceCourseの型定義
 */
export type BoatraceRaceCourse = z.infer<typeof BoatraceRaceCourseSchema>;

export const BoatraceRaceCourseList: string[] = [
    '桐生',
    '戸田',
    '江戸川',
    '平和島',
    '多摩川',
    '浜名湖',
    '蒲郡',
    '常滑',
    '津',
    '三国',
    'びわこ',
    '住之江',
    '尼崎',
    '鳴門',
    '丸亀',
    '児島',
    '宮島',
    '徳山',
    '下関',
    '若松',
    '芦屋',
    '福岡',
    '唐津',
    '大村',
];

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
 * ボートレースのグレード
 */
export const BOATRACE_SPECIFIED_GRADE_LIST: BoatraceGradeType[] = [
    'SG',
    'GⅠ',
    'GⅡ',
    'GⅢ',
    '一般',
];

/**
 * BoatraceRaceStageのzod型定義
 */
export const BoatraceRaceStageSchema = z.string().refine((value) => {
    return BoatraceRaceStageList.includes(value);
}, 'ボートレースのステージではありません');

/**
 * BoatraceRaceStageの型定義
 */
export type BoatraceRaceStage = z.infer<typeof BoatraceRaceStageSchema>;

/**
 * ボートレースのステージ リスト
 */
const BoatraceRaceStageList: string[] = ['優勝戦', '準優勝戦', '一般戦', ''];

/**
 * HTMLのステージ名を正式名称に変換するためのマップ
 */
export const BOATRACE_STAGE_MAP: Record<string, BoatraceRaceStage> = {
    準優勝戦: '準優勝戦',
    優勝戦: '優勝戦',
};

/**
 * ボートレースの指定グレード・ステージリスト
 */
export const BOATRACE_SPECIFIED_GRADE_AND_STAGE_LIST: {
    grade: BoatraceGradeType;
    stage: BoatraceRaceStage;
    priority: number;
}[] = [{ grade: 'SG', stage: '優勝戦', priority: 10 }];

/**
 * ボートレースの選手リスト
 */
export const BoatracePlayerList = [
    {
        playerNumber: 4320,
        name: '峰竜太',
        priority: 6,
    },
];

/**
 * BoatraceRaceNumberのzod型定義
 * 1~12の整数
 */
export const BoatraceRaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');

/**
 * BoatraceRaceNumberの型定義
 */
export type BoatraceRaceNumber = z.infer<typeof BoatraceRaceNumberSchema>;

/**
 * BoatracePositionNumberのzod型定義
 */
export const BoatracePositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(6, '枠番は6以下である必要があります');

/**
 * BoatracePositionNumberの型定義
 * 1~8の整数
 */
export type BoatracePositionNumber = z.infer<
    typeof BoatracePositionNumberSchema
>;

/**
 * BoatracePlayerNumberのzod型定義
 */
export const BoatracePlayerNumberSchema = z
    .number()
    .int()
    .min(1, '選手番号は1以上である必要があります');

/**
 * BoatracePlayerNumberの型定義
 */
export type BoatracePlayerNumber = z.infer<typeof BoatracePlayerNumberSchema>;
