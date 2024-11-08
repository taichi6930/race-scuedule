import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import { Logger } from '../../utility/logger';
import { IAutoracePlaceDataHtmlGateway } from '../interface/iAutoracePlaceDataHtmlGateway';
/**
 * オートレース開催データのHTMLを取得するGateway
 */
export class MockAutoracePlaceDataHtmlGateway
    implements IAutoracePlaceDataHtmlGateway
{
    /**
     * オートレース開催データのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - 競馬場開催データのHTML
     */
    @Logger
    getPlaceDataHtml(date: Date): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/autorace/place/${format(date, 'yyyyMM')}.html`;
        // lib/src/gateway/mockData/autorace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }
}
