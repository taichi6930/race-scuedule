import { Logger } from '../../utility/logger';
import { IKeirinPlaceDataHtmlGateway } from '../interface/iKeirinPlaceDataHtmlGateway';
/**
 * 競馬場開催データのHTMLを取得するGateway
 */
export class MockKeirinPlaceDataHtmlGateway
    implements IKeirinPlaceDataHtmlGateway
{
    testHtmlUrl = ``;

    /**
     * 競馬場開催データのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - 競馬場開催データのHTML
     */
    @Logger
    getPlaceDataHtml(date: Date): Promise<string> {
        try {
            console.log(date);
            return Promise.resolve(this.testHtmlUrl);
        } catch (error) {
            console.debug('htmlを取得できませんでした', error);
            throw new Error('htmlを取得できませんでした');
        }
    }
}
