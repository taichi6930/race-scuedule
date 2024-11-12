import type { PlaceEntity } from '../entity/baseEntity';

/**
 * 競馬場データ登録リクエスト
 */
export class RegisterPlaceListRequest<P extends PlaceEntity> {
    constructor(
        // レースデータ
        public readonly placeDataList: P[],
    ) {}
}
