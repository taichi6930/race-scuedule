import { format } from 'date-fns';
import puppeteer from 'puppeteer';

import {
    BOATRACE_PLACE_CODE,
    BoatraceRaceCourse,
} from '../../utility/data/boatrace';
import { Logger } from '../../utility/logger';
import { IBoatraceRaceDataHtmlGateway } from '../interface/iBoatraceRaceDataHtmlGateway';

/**
 * レースデータのHTMLを取得するGateway
 */
export class BoatraceRaceDataHtmlGateway
    implements IBoatraceRaceDataHtmlGateway
{
    /**
     * レースデータのHTMLを取得する
     *
     * @param date - 取得する年月
     * @param place - ボートレース場
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(
        date: Date,
        place: BoatraceRaceCourse,
    ): Promise<string> {
        const raceDate = format(date, 'yyyyMMdd');
        const babacode = BOATRACE_PLACE_CODE[place];
        const url = `https://www.boatrace.jp/owsp/sp/race/raceindex?hd=${raceDate}&jcd=${babacode}`;

        let browser;
        try {
            // Puppeteerでブラウザを起動
            browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            // ページを開く
            await page.goto(url, { waitUntil: 'networkidle2' });

            // JavaScript実行後のHTMLを取得
            const html = await page.content();
            return html;
        } catch (error) {
            console.debug('HTMLを取得できませんでした', error);
            throw new Error('HTMLを取得できませんでした');
        } finally {
            // ブラウザを閉じる
            if (browser) {
                await browser.close();
            }
        }
    }
}
