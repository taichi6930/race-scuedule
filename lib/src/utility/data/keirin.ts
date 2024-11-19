/**
 * 競輪のレース場名とコードの対応表
 */
export const KEIRIN_PLACE_CODE: Record<string, string> = {
    函館: '11',
    青森: '12',
    いわき平: '13',
    弥彦: '21',
    前橋: '22',
    取手: '23',
    宇都宮: '24',
    大宮: '25',
    西武園: '26',
    京王閣: '27',
    立川: '28',
    松戸: '31',
    千葉: '32',
    川崎: '34',
    平塚: '35',
    小田原: '36',
    伊東: '37',
    静岡: '38',
    名古屋: '42',
    岐阜: '43',
    大垣: '44',
    豊橋: '45',
    富山: '46',
    松阪: '47',
    四日市: '48',
    福井: '51',
    奈良: '53',
    向日町: '54',
    和歌山: '55',
    岸和田: '56',
    玉野: '61',
    広島: '62',
    防府: '63',
    高松: '71',
    小松島: '73',
    高知: '74',
    松山: '75',
    小倉: '81',
    久留米: '83',
    武雄: '84',
    佐世保: '85',
    別府: '86',
    熊本: '87',
};

/**
 * HTMLのステージ名を正式名称に変換するためのマップ
 */
export const KEIRIN_STAGE_MAP: Record<string, KeirinRaceStage> = {
    'Ｓ級ＧＰ': 'S級グランプリ',
    'Ｌ級ＧＧＰ': 'L級ガールズグランプリ',
    'ＳＡ混合ＹＧＰ': 'SA混合ヤンググランプリ',
    'Ｓ級ＳＴＲ': 'S級スタールビー賞',
    'Ｓ級ＤＭＤ': 'S級ダイヤモンドレース',
    'Ｓ級シャイ': 'S級シャイニングスター賞',
    'Ｓ級毘沙門': 'S級毘沙門天賞',
    'Ｓ級一予': 'S級一次予選',
    'Ｓ級一予1': 'S級一次予選',
    'Ｓ級一予2': 'S級一次予選',
    'Ｓ級特選予': 'S級特別選抜予選',
    'Ｓ級特一般': 'S級特一般',
    'Ｓ級二予': 'S級二次予選',
    'Ｓ級準決勝': 'S級準決勝',
    'Ｓ級特選': 'S級特選',
    'Ｓ級選抜': 'S級選抜',
    'Ｓ級一般': 'S級一般',
    'Ｓ級特秀': 'S級特別優秀',
    'Ｓ級優秀': 'S級優秀',
    'Ｓ級決勝': 'S級決勝',
    'Ｓ級初特選': 'S級初日特別選抜',
    'Ｓ級西予二予': 'S級西日本二次予選',
    'Ｓ級西予[１２]': 'S級西日本一次予選',
    'Ｓ級東二予': 'S級東日本二次予選',
    'Ｓ級東予[１２]': 'S級東日本一次予選',
    'Ｓ級白虎賞': 'S級白虎賞',
    'Ｓ級青龍賞': 'S級青龍賞',
    'Ｓ級西準決': 'S級西日本準決勝',
    'Ｓ級東準決': 'S級東日本準決勝',
    'Ｓ級西特選': 'S級西日本特別選抜予選',
    'Ｓ級東特選': 'S級東日本特別選抜予選',
    'Ｓ級ＧＤＲ': 'S級ゴールデンレーサー賞',
    'Ｓ級ＤＲＭ': 'S級ドリームレース',
    'Ｓ級ＯＲＩ': 'S級オリオン賞',
    'Ｓ級日競杯': 'S級日本競輪選手会理事長杯',
    'Ｓ級ローズ': 'S級ローズカップ',
    'Ｓ級予選': 'S級予選',
    'Ｓ級順位決': 'S級順位決定',
    'Ｌ級ＤＲＭ': 'L級ガールズドリームレース',
    'Ｌ級ＡＲＴ': 'L級ガールズアルテミス賞',
    'Ｌ級ガ決勝': 'L級ガールズ決勝',
    'Ｌ級ティア': 'L級ティアラカップ',
    'Ｌ級ガ準決': 'L級ガールズ準決勝',
    'Ｌ級ガ予': 'L級ガールズ予選',
    'Ｌ級ガ特選': 'L級ガールズ特選',
    'Ｌ級ガ選抜': 'L級ガールズ選抜',
    'Ｌ級西ガ準': 'L級ガールズ西日本準決勝',
    'Ｌ級東ガ準': 'L級ガールズ東日本準決勝',
    'Ｌ級西ガ予': 'L級ガールズ西日本予選',
    'Ｌ級東ガ予': 'L級ガールズ東日本予選',
    'Ｌ級Ｇコレ': 'L級ガールズコレクション',
    'ＤＳ': 'S級ダイナミックステージ',
    'ＷＳ': 'S級ワンダーステージ',
    'ＳＰＲ': 'S級スーパープロピストレーサー賞',
};

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
 * 競輪のグレード
 */
export type KeirinGradeType = 'GP' | 'GⅠ' | 'GⅡ' | 'GⅢ' | 'FⅠ' | 'FⅡ';

/**
 * 競輪のステージ
 */
export type KeirinRaceStage =
    | 'S級グランプリ'
    | 'L級ガールズグランプリ'
    | 'SA混合ヤンググランプリ'
    | 'S級一次予選'
    | 'S級二次予選'
    | 'S級特別選抜予選'
    | 'S級初日特別選抜'
    | 'S級特一般'
    | 'S級順位決定'
    | 'S級スタールビー賞'
    | 'S級ゴールデンレーサー賞'
    | 'S級ドリームレース'
    | 'S級オリオン賞'
    | 'S級ダイヤモンドレース'
    | 'S級シャイニングスター賞'
    | 'S級毘沙門天賞'
    | 'S級準決勝'
    | 'S級特選'
    | 'S級選抜'
    | 'S級一般'
    | 'S級優秀'
    | 'S級特別優秀'
    | 'S級決勝'
    | 'S級西日本二次予選'
    | 'S級西日本一次予選'
    | 'S級東日本二次予選'
    | 'S級東日本一次予選'
    | 'S級白虎賞'
    | 'S級青龍賞'
    | 'S級西日本準決勝'
    | 'S級東日本準決勝'
    | 'S級西日本特別選抜予選'
    | 'S級東日本特別選抜予選'
    | 'S級日本競輪選手会理事長杯'
    | 'S級ローズカップ'
    | 'S級予選'
    | 'L級ガールズドリームレース'
    | 'L級ガールズアルテミス賞'
    | 'L級ガールズ決勝'
    | 'L級ガールズ準決勝'
    | 'L級ガールズ予選'
    | 'L級ガールズ特選'
    | 'L級ガールズ選抜'
    | 'L級ガールズ西日本準決勝'
    | 'L級ガールズ東日本準決勝'
    | 'L級ガールズ西日本予選'
    | 'L級ガールズ東日本予選'
    | 'L級ガールズコレクション'
    | 'L級ティアラカップ'
    | 'S級ダイナミックステージ'
    | 'S級ワンダーステージ'
    | 'S級スーパープロピストレーサー賞'
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
    { grade: 'GP', stage: 'S級グランプリ', priority: 10 },
    { grade: 'GP', stage: 'L級ガールズグランプリ', priority: 10 },

    { grade: 'GⅠ', stage: 'S級決勝', priority: 9 },
    { grade: 'GⅠ', stage: 'S級準決勝', priority: 8 },
    { grade: 'GⅠ', stage: 'S級特別選抜予選', priority: 8 },
    { grade: 'GⅠ', stage: 'S級初日特別選抜', priority: 8 },
    { grade: 'GⅠ', stage: 'S級ゴールデンレーサー賞', priority: 8 },
    { grade: 'GⅠ', stage: 'S級ダイヤモンドレース', priority: 8 },
    { grade: 'GⅠ', stage: 'S級ドリームレース', priority: 8 },
    { grade: 'GⅠ', stage: 'S級オリオン賞', priority: 8 },
    { grade: 'GⅠ', stage: 'S級シャイニングスター賞', priority: 8 },
    { grade: 'GⅠ', stage: 'S級スタールビー賞', priority: 8 },
    { grade: 'GⅠ', stage: 'S級白虎賞', priority: 8 },
    { grade: 'GⅠ', stage: 'S級青龍賞', priority: 8 },
    { grade: 'GⅠ', stage: 'S級西日本準決勝', priority: 8 },
    { grade: 'GⅠ', stage: 'S級東日本準決勝', priority: 8 },
    { grade: 'GⅠ', stage: 'S級西日本特別選抜予選', priority: 8 },
    { grade: 'GⅠ', stage: 'S級東日本特別選抜予選', priority: 8 },
    { grade: 'GⅠ', stage: 'S級日本競輪選手会理事長杯', priority: 8 },
    { grade: 'GⅠ', stage: 'S級ローズカップ', priority: 8 },
    { grade: 'GⅠ', stage: 'L級ティアラカップ', priority: 8 },
    { grade: 'GⅠ', stage: 'L級ガールズ決勝', priority: 8 },
    { grade: 'GⅠ', stage: 'L級ガールズ準決勝', priority: 7 },
    { grade: 'GⅠ', stage: 'L級ガールズ西日本準決勝', priority: 7 },
    { grade: 'GⅠ', stage: 'L級ガールズ東日本準決勝', priority: 7 },
    { grade: 'GⅠ', stage: 'L級ガールズドリームレース', priority: 7 },
    { grade: 'GⅠ', stage: 'L級ガールズアルテミス賞', priority: 7 },
    { grade: 'GⅠ', stage: 'L級ガールズコレクション', priority: 7 },
    { grade: 'GⅠ', stage: 'L級ガールズ予選', priority: 4 },
    { grade: 'GⅠ', stage: 'S級特別優秀', priority: 4 },
    { grade: 'GⅠ', stage: 'S級二次予選', priority: 4 },
    { grade: 'GⅠ', stage: 'S級一次予選', priority: 2 },

    { grade: 'GⅡ', stage: 'SA混合ヤンググランプリ', priority: 8 },
    { grade: 'GⅡ', stage: 'S級毘沙門天賞', priority: 8 },
    { grade: 'GⅡ', stage: 'S級決勝', priority: 8 },
    { grade: 'GⅡ', stage: 'S級準決勝', priority: 7 },
    { grade: 'GⅡ', stage: 'S級二次予選', priority: 4 },
    { grade: 'GⅡ', stage: 'S級一次予選', priority: 2 },
    { grade: 'GⅡ', stage: 'S級特別選抜予選', priority: 7 },

    { grade: 'GⅢ', stage: 'S級決勝', priority: 7 },
    { grade: 'GⅢ', stage: 'S級準決勝', priority: 5 },
    { grade: 'GⅢ', stage: 'S級二次予選', priority: 3 },
    { grade: 'GⅢ', stage: 'S級一次予選', priority: 1 },
    { grade: 'GⅢ', stage: 'S級初日特別選抜', priority: 6 },

    { grade: 'FⅠ', stage: 'S級決勝', priority: 4 },
    { grade: 'FⅠ', stage: 'S級準決勝', priority: 3 },
    { grade: 'FⅠ', stage: 'S級予選', priority: 1 },
    { grade: 'GⅢ', stage: 'S級初日特別選抜', priority: 1 },

    { grade: 'FⅡ', stage: 'L級ガールズドリームレース', priority: 7 },
    { grade: 'FⅡ', stage: 'L級ガールズアルテミス賞', priority: 6 },
    { grade: 'FⅡ', stage: 'S級スーパープロピストレーサー賞', priority: 7 },
    { grade: 'FⅡ', stage: 'L級ガールズ決勝', priority: 2 },
    { grade: 'FⅡ', stage: 'L級ガールズ準決勝', priority: 1 },
    { grade: 'FⅡ', stage: 'L級ガールズ予選', priority: 0 },
];

export const KeirinPlayerList = [
    {
        playerNumber: '014396',
        name: '脇本雄太',
        priority: 6,
    },
    {
        playerNumber: '014838',
        name: '古性優作',
        priority: 6,
    },
    {
        playerNumber: '014681',
        name: '松浦悠士',
        priority: 6,
    },
    {
        playerNumber: '013162',
        name: '佐藤慎太郎',
        priority: 6,
    },
    {
        playerNumber: '014534',
        name: '深谷知広',
        priority: 6,
    },
    {
        playerNumber: '015242',
        name: '眞杉匠',
        priority: 5,
    },
    {
        playerNumber: '015009',
        name: '清水裕友',
        priority: 6,
    },
    {
        playerNumber: '014741',
        name: '郡司浩平',
        priority: 6,
    },
    {
        playerNumber: '015413',
        name: '寺崎浩平',
        priority: 3,
    },
    {
        playerNumber: '014054',
        name: '新田祐大',
        priority: 4,
    },
    {
        playerNumber: '015034',
        name: '新山響平',
        priority: 5,
    },
    {
        playerNumber: '015451',
        name: '山口拳矢',
        priority: 2,
    },
    {
        playerNumber: '015527',
        name: '北井佑季',
        priority: 5,
    },
    {
        playerNumber: '015597',
        name: '太田海也',
        priority: 4,
    },
    {
        playerNumber: '015553',
        name: '犬伏湧也',
        priority: 3,
    },
    {
        playerNumber: '015298',
        name: '嘉永泰斗',
        priority: 3,
    },
    // ガールズ
    {
        playerNumber: '015400',
        name: '久米詩',
        priority: 4,
    },
    { playerNumber: '015306', name: '佐藤水菜', priority: 4 },
    {
        playerNumber: '015219',
        name: '梅川風子',
        priority: 3,
    },
    {
        playerNumber: '015080',
        name: '児玉碧衣',
        priority: 4,
    },
    {
        playerNumber: '015587',
        name: '吉川美穂',
        priority: 3,
    },
    {
        playerNumber: '015218',
        name: '太田りゆ',
        priority: 3,
    },
    { playerNumber: '015679', name: '又多風緑', priority: 3 },
    { playerNumber: '015669', name: '河内桜雪', priority: 3 },
];
