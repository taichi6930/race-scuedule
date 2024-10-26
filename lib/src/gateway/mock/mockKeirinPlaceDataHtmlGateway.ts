import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import { Logger } from '../../utility/logger';
import { IKeirinPlaceDataHtmlGateway } from '../interface/iKeirinPlaceDataHtmlGateway';
/**
 * 競馬場開催データのHTMLを取得するGateway
 */
export class MockKeirinPlaceDataHtmlGateway
    implements IKeirinPlaceDataHtmlGateway
{
    constructor() {
        console.log('MockKeirinPlaceDataHtmlGateway constructor');
    }
    /**
     * 競馬場開催データのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - 競馬場開催データのHTML
     */
    @Logger
    getPlaceDataHtml(date: Date): Promise<string> {
        try {
            // mockDataフォルダにあるhtmlを取得
            const testHtmlUrl = `../mockData/keirin/place/${format(date, 'yyyyMM')}.html`;
            // lib/src/gateway/mockData/keirin/placeの中にあるhtmlを取得
            const htmlFilePath = path.join(__dirname, testHtmlUrl);

            const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
            return Promise.resolve(htmlContent);
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
