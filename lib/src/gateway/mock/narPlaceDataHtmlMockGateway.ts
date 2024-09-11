import { INarPlaceDataHtmlGateway } from '../interface/iNarPlaceDataHtmlGateway';
import { mockNarPlaceHtml } from './mockHtml';

/**
 * 競馬場開催データのHTMLを取得するGateway（mock）
 */
export class NarPlaceDataHtmlMockGateway implements INarPlaceDataHtmlGateway {
    constructor() {
        console.debug('NarPlaceDataHtmlMockGatewayが呼ばれました');
    }

    /**
     * 競馬場開催データのHTMLを取得する
     *
     * @param date - 取得する年月
     * @returns Promise<string> - 競馬場開催データのHTML
     */
    async getPlaceDataHtml(date: Date): Promise<string> {
        // モックデータを返す
        const raceId: string = `${date.getFullYear()}${date.getXDigitMonth(2)}`;
        return mockNarPlaceHtml[raceId];
    }
}
