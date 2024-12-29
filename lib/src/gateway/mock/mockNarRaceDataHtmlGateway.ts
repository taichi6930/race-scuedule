import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import { NAR_BABACODE } from '../../utility/data/nar';
import { NarRaceCourse } from '../../utility/data/nar';
import { Logger } from '../../utility/logger';
import { INarRaceDataHtmlGateway } from '../interface/iNarRaceDataHtmlGateway';
/**
 * レースデータのHTMLを取得するGateway
 */
export class MockNarRaceDataHtmlGateway implements INarRaceDataHtmlGateway {
    /**
     * レースデータのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - レースデータのHTML
     */
    @Logger
    async getRaceDataHtml(date: Date, place: NarRaceCourse): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/html/nar/race/${format(date, 'yyyyMMdd')}${NAR_BABACODE[place]}.html`;
        // lib/src/gateway/mockData/html/nar/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }

    html = ``;
}
