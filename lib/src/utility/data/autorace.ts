import type { AutoraceRaceCourse, AutoraceRaceStage } from './raceSpecific';

/**
 * オートレースのレース場名とコードの対応表
 */
export const AUTORACE_PLACE_CODE: Record<AutoraceRaceCourse, string> = {
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
};
