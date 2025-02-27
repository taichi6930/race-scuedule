/**
 * オートレース開催データのHTMLを取得するGatewayのInterface
 */
export interface IAutoracePlaceDataHtmlGateway {
    /**
     * 開催データのHTMLを取得する
     * @param date - 取得する年月
     */
    getPlaceDataHtml: (date: Date) => Promise<string>;
}
