import type { AutoraceRaceStage } from './raceSpecific';

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
