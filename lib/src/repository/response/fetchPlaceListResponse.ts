import type { PlaceEntity } from '../entity/baseEntity';

/**
 * 競馬場一覧取得レスポンス
 */
export class FetchPlaceListResponse<P extends PlaceEntity> {
    constructor(public readonly placeEntityList: P[]) {}
}
