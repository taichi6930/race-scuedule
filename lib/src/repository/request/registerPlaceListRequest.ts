/**
 * 競馬場データ登録リクエスト
 */
export class RegisterPlaceListRequest<P> {
    constructor(
        // レースデータ
        public readonly placeDataList: P[],
    ) {
    }
}