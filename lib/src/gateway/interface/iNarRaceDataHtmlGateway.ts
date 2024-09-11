import { NarRaceCourse } from '../../utility/data/raceSpecific';

/**
 * 地方競馬のレースデータのHTMLを取得するGatewayのInterface
 */
export interface INarRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     * @param date 日付
     * @param place 競馬場
     * @returns レースデータのHTML
     */
    getRaceDataHtml(date: Date, place: NarRaceCourse): Promise<string>;
}
