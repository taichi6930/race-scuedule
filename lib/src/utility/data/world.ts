import z from 'zod';

/**
 * WorldGradeTypeのzod型定義
 */
export const WorldGradeTypeSchema = z.string().refine((value) => {
    return WorldGradeTypeList.includes(value);
}, '世界の競馬のグレードではありません');

/**
 * WorldGradeTypeの型定義
 */
export type WorldGradeType = z.infer<typeof WorldGradeTypeSchema>;

/**
 * 世界の競馬のグレード リスト
 */
export const WorldGradeTypeList: string[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'Listed',
    '格付けなし',
];

/**
 * WorldRaceCourseのzod型定義
 */
export const WorldRaceCourseSchema = z.string().refine((value) => {
    return WorldRaceCourseList.includes(value);
}, '世界の競馬場ではありません');

/**
 * WorldRaceCourseの型定義
 */
export type WorldRaceCourse = z.infer<typeof WorldRaceCourseSchema>;

/**
 * 世界の競馬場 リスト
 */
export const WorldRaceCourseList: string[] = [
    'ロンシャン',
    'パリロンシャン',
    'シャンティイ',
    'サンクルー',
    'ドーヴィル',
    'アスコット',
    'ニューマーケット',
    'ニューベリー',
    'エプソム',
    'グッドウッド',
    'サンダウン',
    'ヨーク',
    'ヘイドック',
    'ドンカスター',
    'レパーズタウン',
    'カラ',
    'ガルフストリームパーク',
    'サンタアニタパーク',
    'チャーチルダウンズ',
    'ピムリコ',
    'サラトガ',
    'アケダクト',
    'モンマスパーク',
    'ベルモントパーク',
    'コロニアルダウンズ',
    'デルマー',
    'パークスレーシング',
    'キーンランド',
    'オークローンパーク',
    'ミュンヘン',
    'ホッペガルテン',
    'バーデンバーデン',
    'シャティン',
    'キングアブドゥルアジーズ',
    'メイダン',
    'ランドウィック',
    'コーフィールド',
    'フレミントン',
    'メルボルン',
    'ムーニーバレー',
    'ローズヒルガーデンズ',
];

/**
 * WorldRaceCourseTypeのzod型定義
 */
export const WorldRaceCourseTypeSchema = z.string().refine((value) => {
    return WorldRaceCourseTypeList.includes(value);
}, '世界の競馬の馬場種別ではありません');

/**
 * WorldRaceCourseTypeの型定義
 */
export type WorldRaceCourseType = z.infer<typeof WorldRaceCourseTypeSchema>;

/**
 * 世界の競馬の馬場種別 リスト
 */
export const WorldRaceCourseTypeList: string[] = ['芝', 'ダート', '障害', 'AW'];

/**
 * 世界の競馬の指定グレードリスト
 */
export const WORLD_SPECIFIED_GRADE_LIST: WorldGradeType[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'Listed',
    '格付けなし',
];

/**
 * 海外の競馬場のレース場名とコードの対応表
 */
export const WORLD_PLACE_CODE: Record<string, string> = {
    ロンシャン: 'longchamp',
    パリロンシャン: 'longchamp',
    シャンティイ: 'chantilly',
    サンクルー: 'saintcloud',
    ドーヴィル: 'deauville',
    アスコット: 'ascot',
    ニューマーケット: 'newmarket',
    ニューベリー: 'newbury',
    エプソム: 'epsom',
    グッドウッド: 'goodwood',
    サンダウン: 'sandown',
    ヨーク: 'york',
    ヘイドック: 'haydock',
    ドンカスター: 'doncaster',
    レパーズタウン: 'leopardstown',
    カラ: 'curragh',
    ガルフストリームパーク: 'gulfstreampark',
    サンタアニタパーク: 'santaanitapark',
    チャーチルダウンズ: 'churchill-downs',
    ピムリコ: 'pimlico',
    サラトガ: 'saratoga',
    アケダクト: 'aqueduct',
    モンマスパーク: 'monmouthpark',
    ベルモントパーク: 'belmontpark',
    コロニアルダウンズ: 'colonial-downs',
    デルマー: 'delmar',
    パークスレーシング: 'parxracing',
    キーンランド: 'keeneland',
    オークローンパーク: 'oaklawnpark',
    ミュンヘン: 'munich',
    ホッペガルテン: 'hoppegarten',
    バーデンバーデン: 'badenbaden',
    シャティン: 'shatin',
    キングアブドゥルアジーズ: 'king-abdulaziz',
    メイダン: 'meydan',
    ランドウィック: 'randwick',
    コーフィールド: 'caulfield',
    フレミントン: 'flemington',
    メルボルン: 'melbourne',
    ムーニーバレー: 'mooneevalley',
    ローズヒルガーデンズ: 'rosehill-gardens',
};

/**
 * WorldRaceDistanceのzod型定義
 */
export const WorldRaceDistanceSchema = z
    .number()
    .positive('距離は0よりも大きい必要があります');

/**
 * WorldRaceDistanceの型定義
 */
export type WorldRaceDistance = z.infer<typeof WorldRaceDistanceSchema>;

/**
 * WorldRaceNumberのzod型定義
 * 1~12の整数
 */
export const WorldRaceNumberSchema = z
    .number()
    .int()
    .min(1, 'レース番号は1以上である必要があります')
    .max(12, 'レース番号は12以下である必要があります');

/**
 * WorldRaceNumberの型定義
 */
export type WorldRaceNumber = z.infer<typeof WorldRaceNumberSchema>;
