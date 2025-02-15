/**
 * ボートレース場開催データのHTMLを取得するGatewayのInterface
 */
export interface IBoatracePlaceDataHtmlGateway {
    /**
     * 開催データのHTMLを取得する
     * @param quarter - 取得するクォーター
     */
    getPlaceDataHtml: (quarter: string) => Promise<string>;
}
