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
export type KeirinRaceStage =
    | 'グランプリ'
    | 'ガールズグランプリ'
    | 'ヤンググランプリ'
    | '一次予選'
    | '二次予選'
    | '特別選抜予選'
    | '初日特別選抜'
    | '特一般'
    | '順位決定'
    | 'スタールビー賞'
    | 'ゴールデンレーサー賞'
    | 'ドリームレース'
    | 'オリオン賞'
    | 'ダイヤモンドレース'
    | 'シャイニングスター賞'
    | '毘沙門天賞'
    | '準決勝'
    | '特選'
    | '選抜'
    | '一般'
    | '優秀'
    | '特別優秀'
    | '決勝'
    | '西日本二次予選'
    | '西日本一次予選'
    | '東日本二次予選'
    | '東日本一次予選'
    | '白虎賞'
    | '青龍賞'
    | '西日本準決勝'
    | '東日本準決勝'
    | '西日本特別選抜予選'
    | '東日本特別選抜予選'
    | '日本競輪選手会理事長杯'
    | 'ローズカップ'
    | '予選'
    | 'ガールズドリームレース'
    | 'ガールズアルテミス賞'
    | 'ガールズ決勝'
    | 'ガールズ準決勝'
    | 'ガールズ予選'
    | 'ガールズ特選'
    | 'ガールズ選抜'
    | 'ガールズ西日本準決勝'
    | 'ガールズ東日本準決勝'
    | 'ガールズ西日本予選'
    | 'ガールズ東日本予選'
    | 'ガールズコレクション'
    | 'ティアラカップ'
    | 'ダイナミックステージ'
    | 'ワンダーステージ'
    | 'スーパープロピストレーサー賞'
    | '';

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

/**
 * 競輪の指定グレード・ステージリスト
 */
export const KEIRIN_SPECIFIED_GRADE_AND_STAGE_LIST: {
    grade: KeirinGradeType;
    stage: KeirinRaceStage;
    priority: number;
}[] = [
    { grade: 'GP', stage: 'グランプリ', priority: 10 },
    { grade: 'GP', stage: 'ガールズグランプリ', priority: 10 },

    { grade: 'GⅠ', stage: '決勝', priority: 9 },
    { grade: 'GⅠ', stage: '準決勝', priority: 8 },
    { grade: 'GⅠ', stage: '特別選抜予選', priority: 8 },
    { grade: 'GⅠ', stage: '初日特別選抜', priority: 8 },
    { grade: 'GⅠ', stage: 'ゴールデンレーサー賞', priority: 8 },
    { grade: 'GⅠ', stage: 'ダイヤモンドレース', priority: 8 },
    { grade: 'GⅠ', stage: 'ドリームレース', priority: 8 },
    { grade: 'GⅠ', stage: 'オリオン賞', priority: 8 },
    { grade: 'GⅠ', stage: 'シャイニングスター賞', priority: 8 },
    { grade: 'GⅠ', stage: 'スタールビー賞', priority: 8 },
    { grade: 'GⅠ', stage: '白虎賞', priority: 8 },
    { grade: 'GⅠ', stage: '青龍賞', priority: 8 },
    { grade: 'GⅠ', stage: '西日本準決勝', priority: 8 },
    { grade: 'GⅠ', stage: '東日本準決勝', priority: 8 },
    { grade: 'GⅠ', stage: '西日本特別選抜予選', priority: 8 },
    { grade: 'GⅠ', stage: '東日本特別選抜予選', priority: 8 },
    { grade: 'GⅠ', stage: '日本競輪選手会理事長杯', priority: 8 },
    { grade: 'GⅠ', stage: 'ローズカップ', priority: 8 },
    { grade: 'GⅠ', stage: 'ティアラカップ', priority: 8 },
    { grade: 'GⅠ', stage: 'ガールズ決勝', priority: 8 },
    { grade: 'GⅠ', stage: 'ガールズ準決勝', priority: 7 },
    { grade: 'GⅠ', stage: 'ガールズ西日本準決勝', priority: 7 },
    { grade: 'GⅠ', stage: 'ガールズ東日本準決勝', priority: 7 },
    { grade: 'GⅠ', stage: 'ガールズドリームレース', priority: 7 },
    { grade: 'GⅠ', stage: 'ガールズアルテミス賞', priority: 7 },

    { grade: 'GⅡ', stage: 'ヤンググランプリ', priority: 8 },
    { grade: 'GⅡ', stage: '毘沙門天賞', priority: 8 },
    { grade: 'GⅡ', stage: '決勝', priority: 8 },
    { grade: 'GⅡ', stage: '準決勝', priority: 7 },
    { grade: 'GⅡ', stage: '特別選抜予選', priority: 7 },

    { grade: 'GⅢ', stage: '決勝', priority: 7 },
    { grade: 'GⅢ', stage: '初日特別選抜', priority: 6 },

    { grade: 'FⅠ', stage: '決勝', priority: 4 },

    { grade: 'FⅡ', stage: 'ガールズドリームレース', priority: 7 },
    { grade: 'FⅡ', stage: 'ガールズアルテミス賞', priority: 6 },
    { grade: 'FⅡ', stage: 'スーパープロピストレーサー賞', priority: 7 },
];

/**
 * 世界の競馬のグレード
 */
export type WorldGradeType = 'GⅠ' | 'GⅡ' | 'GⅢ' | 'Listed' | '格付けなし';

/**
 * 世界の競馬場
 */
export type WorldRaceCourse =
    // フランス
    | 'ロンシャン'
    | 'パリロンシャン'
    | 'シャンティイ'
    | 'サンクルー'
    | 'ドーヴィル'
    // イギリス
    | 'アスコット'
    | 'ニューマーケット'
    | 'ニューベリー'
    | 'エプソム'
    | 'グッドウッド'
    | 'サンダウン'
    | 'ヨーク'
    | 'ヘイドック'
    | 'ドンカスター'
    // アイルランド
    | 'レパーズタウン'
    | 'カラ'
    // アメリカ
    | 'ガルフストリームパーク'
    | 'サンタアニタパーク'
    | 'チャーチルダウンズ'
    | 'ピムリコ'
    | 'サラトガ'
    | 'アケダクト'
    | 'モンマスパーク'
    | 'ベルモントパーク'
    | 'コロニアルダウンズ'
    | 'デルマー'
    | 'パークスレーシング'
    | 'キーンランド'
    | 'オークローンパーク'
    // ドイツ
    | 'ミュンヘン'
    | 'ホッペガルテン'
    | 'バーデンバーデン'
    // 香港
    | 'シャティン'
    // サウジアラビア
    | 'キングアブドゥルアジーズ'
    // ドバイ
    | 'メイダン'
    // オーストラリア
    | 'ランドウィック'
    | 'コーフィールド'
    | 'フレミントン'
    | 'メルボルン'
    | 'ムーニーバレー'
    | 'ローズヒルガーデンズ';

/**
 * 世界の競馬の馬場種別
 */
export type WorldRaceCourseType = '芝' | 'ダート' | '障害' | 'AW';

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
 * オートレースのグレードリスト
 */
export type AutoraceGradeType = 'SG' | '特GⅠ' | 'GⅠ' | 'GⅡ' | '開催';
/**
 * オートレースの指定グレードリスト
 */
export const AUTORACE_SPECIFIED_GRADE_LIST: AutoraceGradeType[] = ['SG'];

/**
 * オートレースのステージ
 */
export type AutoraceRaceStage = '優勝戦' | '準優勝戦' | '';

/**
 * オートレースの指定グレード・ステージリスト
 */
export const AUTORACE_SPECIFIED_GRADE_AND_STAGE_LIST: {
    grade: AutoraceGradeType;
    stage: AutoraceRaceStage;
    priority: number;
}[] = [{ grade: 'SG', stage: '優勝戦', priority: 9 }];

/**
 * オートレース場
 */
export type AutoraceRaceCourse =
    | '船橋'
    | '川口'
    | '伊勢崎'
    | '浜松'
    | '飯塚'
    | '山陽';
