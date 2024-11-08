import type { AutoraceRaceCourse } from '../../utility/data/raceSpecific';

/**
 * 競輪場のレースデータのHTMLを取得するGatewayのInterface
 */
export interface IAutoraceRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date 日付
     * @param place 競馬場
     * @returns レースデータのHTML
     */
    getRaceDataHtml: (date: Date, place: AutoraceRaceCourse) => Promise<string>;
}
