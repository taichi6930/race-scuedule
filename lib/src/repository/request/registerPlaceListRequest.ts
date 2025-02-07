import type { IPlaceEntity } from '../entity/iPlaceEntity';

/**
 * 競馬場データ登録リクエスト
 */
export class RegisterPlaceListRequest<P extends IPlaceEntity<P>> {
    constructor(
        // レースデータ
        public readonly placeEntityList: P[],
    ) {}
}
