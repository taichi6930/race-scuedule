import { format } from 'date-fns';

import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';
import { KeirinRaceCourse } from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { IKeirinRaceDataHtmlGateway } from '../interface/iKeirinRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class KeirinRaceDataHtmlGateway implements IKeirinRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(
        date: Date,
        place: KeirinRaceCourse,
    ): Promise<string> {
        const raceDate = format(date, 'yyyyMMdd');
        const babacode = KEIRIN_PLACE_CODE[place];
        const url = `https://www.oddspark.com/keirin/AllRaceList.do?joCode=${babacode}&kaisaiBi=${raceDate}`;

        // gokeibaのURLからHTMLを取得する
        try {
            const html = await fetch(url);
            const htmlText = await html.text();
            return htmlText;
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
