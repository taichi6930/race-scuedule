import { format } from 'date-fns';

import { Logger } from '../../utility/logger';
import { IJraRaceDataHtmlGateway } from '../interface/iJraRaceDataHtmlGateway';

export class JraRaceDataHtmlGateway implements IJraRaceDataHtmlGateway {
    constructor() {
        console.debug('JraRaceDataHtmlGatewayが呼ばれました');
    }

    /**
     * JRAのレースデータのHTMLを取得する
     * @param date
     * @returns
     */
    @Logger
    async getRaceDataHtml(date: Date): Promise<string> {
        const raceId = format(date, 'yyyyMMdd');
        // keibalabのURLからHTMLを取得する
        try {
            const url = `https://www.keibalab.jp/db/race/${raceId}/`;
            const html = await fetch(url);
            const htmlText = await html.text();
            return htmlText;
        } catch (e) {
            console.error(e, 'htmlを取得できませんでした');
            throw new Error('htmlを取得できませんでした');
        }
    }
}
