import { NAR_BABACODE } from "../../utility/data/nar";
import { NarRaceCourse } from "../../utility/data/raceSpecific";
import { INarRaceDataHtmlGateway } from "../interface/iNarRaceDataHtmlGateway";
import { mockNarRaceHtml } from "./mockHtml";


/**
 * 地方競馬のレースデータのHTMLを取得するGatewayのモック
 */
export class NarRaceDataHtmlMockGateway implements INarRaceDataHtmlGateway {
    constructor() {
        console.debug('NarRaceDataHtmlMockGatewayが呼ばれました');
    }

    /**
     * 地方競馬のレースデータのHTMLを取得する
     * @param date
     * @param place
     * @returns
     */
    async getRaceDataHtml(date: Date, place: NarRaceCourse): Promise<string> {
        const raceId: string = `${date.getFullYear()}${date.getXDigitMonth(2)}${date.getXDigitDays(2)}${Number(NAR_BABACODE[place]).toXDigits(2)}`;
        return mockNarRaceHtml[raceId];
    }
}