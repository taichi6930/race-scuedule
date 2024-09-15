import { NAR_BABACODE } from '../../utility/data/nar';
import { NarRaceCourse } from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { INarRaceDataHtmlGateway } from '../interface/iNarRaceDataHtmlGateway';

export class NarRaceDataHtmlGateway implements INarRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(date: Date, place: NarRaceCourse): Promise<string> {
        const raceDate = `${date.getFullYear()}%2f${date.getXDigitMonth(2)}%2f${date.getXDigitDays(2)}`;
        const babacode = NAR_BABACODE[place];
        const url = `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${raceDate}&k_babaCode=${babacode}`;

        // gokeibaのURLからHTMLを取得する
        try {
            const html = await fetch(url);
            console.debug(`htmlを取得しています ${url}`);
            const htmlText = await html.text();
            console.log(`htmlを取得できました ${url}`);
            return htmlText;
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            return '';
        }
    }
}
