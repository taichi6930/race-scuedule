/**
 * JRAの競馬場
 */
export type JraRaceCourse =
    | '札幌'
    | '函館'
    | '福島'
    | '新潟'
    | '東京'
    | '中山'
    | '中京'
    | '京都'
    | '阪神'
    | '小倉';

/**
 * JRAの馬場種別
 */
export type JraRaceCourseType = '芝' | 'ダート' | '障害';

/**
 * NARの競馬場
 */
export type NarRaceCourse =
    | '北見ば'
    | '岩見ば'
    | '帯広ば'
    | '旭川ば'
    | '旭川'
    | '門別'
    | '札幌'
    | '盛岡'
    | '水沢'
    | '上山'
    | '新潟'
    | '三条'
    | '足利'
    | '宇都宮'
    | '高崎'
    | '浦和'
    | '船橋'
    | '大井'
    | '川崎'
    | '金沢'
    | '笠松'
    | '名古屋'
    | '中京'
    | '園田'
    | '姫路'
    | '益田'
    | '福山'
    | '高知'
    | '佐賀'
    | '荒尾'
    | '中津';

/**
 * NARの馬場種別
 */
export type NarRaceCourseType = '芝' | 'ダート';

/**
 * 競輪場
 */
export type KeirinRaceCourse =
    | '函館'
    | '青森'
    | 'いわき平'
    | '弥彦'
    | '前橋'
    | '取手'
    | '宇都宮'
    | '大宮'
    | '西武園'
    | '京王閣'
    | '立川'
    | '松戸'
    | '千葉'
    | '川崎'
    | '平塚'
    | '小田原'
    | '伊東'
    | '静岡'
    | '名古屋'
    | '岐阜'
    | '大垣'
    | '豊橋'
    | '富山'
    | '松阪'
    | '四日市'
    | '福井'
    | '奈良'
    | '向日町'
    | '和歌山'
    | '岸和田'
    | '玉野'
    | '広島'
    | '防府'
    | '高松'
    | '小松島'
    | '高知'
    | '松山'
    | '小倉'
    | '久留米'
    | '武雄'
    | '佐世保'
    | '別府'
    | '熊本';

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

/**
 * NARのグレード
 */
export type NarGradeType =
    | 'GⅠ'
    | 'GⅡ'
    | 'GⅢ'
    | 'JpnⅠ'
    | 'JpnⅡ'
    | 'JpnⅢ'
    | '重賞'
    | '地方重賞'
    | 'Listed'
    | 'オープン特別'
    | '地方準重賞'
    | '格付けなし'
    | 'オープン'
    | '未格付'
    | '一般';

/**
 * NARの指定グレードリスト
 */
export const NAR_SPECIFIED_GRADE_LIST: NarGradeType[] = [
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'JpnⅠ',
    'JpnⅡ',
    'JpnⅢ',
    '重賞',
    'Listed',
    'オープン特別',
    '地方重賞',
    '地方準重賞',
];

/**
 * 競輪のグレード
 */
export type KeirinGradeType = 'GP' | 'GⅠ' | 'GⅡ' | 'GⅢ' | 'FⅠ' | 'FⅡ';

/**
 * 競輪のステージ
 */
export type KeirinRaceStage = '決勝';

/**
 * 競輪の指定グレードリスト
 */
export const KEIRIN_SPECIFIED_GRADE_LIST: KeirinGradeType[] = [
    'GP',
    'GⅠ',
    'GⅡ',
    'GⅢ',
    'FⅠ',
    'FⅡ',
];
