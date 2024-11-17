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
