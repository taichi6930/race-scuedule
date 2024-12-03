import * as fs from 'fs';
import * as path from 'path';

import { Logger } from '../../utility/logger';
import { IBoatracePlaceDataHtmlGateway } from '../interface/iBoatracePlaceDataHtmlGateway';
/**
 * ボートレース開催データのHTMLを取得するGateway
 */
export class MockBoatracePlaceDataHtmlGateway
    implements IBoatracePlaceDataHtmlGateway
{
    /**
     * ボートレース開催データのHTMLを取得する
     *
     * @param quarter - 取得するクォーター
     * @returns Promise<string> - ボートレース場開催データのHTML
     */
    @Logger
    getPlaceDataHtml(quarter: string): Promise<string> {
        // mockDataフォルダにあるhtmlを取得
        const testHtmlUrl = `../mockData/boatrace/place/${quarter}.html`;
        // lib/src/gateway/mockData/boatrace/placeの中にあるhtmlを取得
        const htmlFilePath = path.join(__dirname, testHtmlUrl);

        const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        return Promise.resolve(htmlContent);
    }
}
