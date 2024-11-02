import type { KeirinRaceStage } from './raceSpecific';

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
    'Ｓ級ＧＰ': 'グランプリ',
    'Ｌ級ＧＧＰ': 'ガールズグランプリ',
    'ＳＡ混合ＹＧＰ': 'ヤンググランプリ',
    'Ｓ級ＳＴＲ': 'スタールビー賞',
    'Ｓ級ＤＭＤ': 'ダイヤモンドレース',
    'Ｓ級シャイ': 'シャイニングスター賞',
    'Ｓ級毘沙門': '毘沙門天賞',
    'Ｓ級一予': '一次予選',
    'Ｓ級特選予': '特別選抜予選',
    'Ｓ級特一般': '特一般',
    'Ｓ級二予': '二次予選',
    'Ｓ級準決勝': '準決勝',
    'Ｓ級特選': '特選',
    'Ｓ級選抜': '選抜',
    'Ｓ級一般': '一般',
    'Ｓ級特秀': '特別優秀',
    'Ｓ級優秀': '優秀',
    'Ｓ級決勝': '決勝',
    'Ｓ級初特選': '初日特別選抜',
    'Ｓ級西予二予': '西日本二次予選',
    'Ｓ級西予[１２]': '西日本一次予選',
    'Ｓ級東二予': '東日本二次予選',
    'Ｓ級東予[１２]': '東日本一次予選',
    'Ｓ級白虎賞': '白虎賞',
    'Ｓ級青龍賞': '青龍賞',
    'Ｓ級西準決': '西日本準決勝',
    'Ｓ級東準決': '東日本準決勝',
    'Ｓ級西特選': '西日本特別選抜予選',
    'Ｓ級東特選': '東日本特別選抜予選',
    'Ｓ級ＧＤＲ': 'ゴールデンレーサー賞',
    'Ｓ級ＤＲＭ': 'ドリームレース',
    'Ｓ級ＯＲＩ': 'オリオン賞',
    'Ｓ級日競杯': '日本競輪選手会理事長杯',
    'Ｓ級ローズ': 'ローズカップ',
    'Ｓ級予選': '予選',
    'Ｓ級順位決': '順位決定',
    'Ｌ級ＤＲＭ': 'ガールズドリームレース',
    'Ｌ級ＡＲＴ': 'ガールズアルテミス賞',
    'Ｌ級ガ決勝': 'ガールズ決勝',
    'Ｌ級ティア': 'ティアラカップ',
    'Ｌ級ガ準決': 'ガールズ準決勝',
    'Ｌ級ガ予': 'ガールズ予選',
    'Ｌ級ガ特選': 'ガールズ特選',
    'Ｌ級ガ選抜': 'ガールズ選抜',
    'Ｌ級西ガ準': 'ガールズ西日本準決勝',
    'Ｌ級東ガ準': 'ガールズ東日本準決勝',
    'Ｌ級西ガ予': 'ガールズ西日本予選',
    'Ｌ級東ガ予': 'ガールズ東日本予選',
    'Ｌ級Ｇコレ': 'ガールズコレクション',
    'ＤＳ': 'ダイナミックステージ',
    'ＷＳ': 'ワンダーステージ',
    'ＳＰＲ': 'スーパープロピストレーサー賞',
};
