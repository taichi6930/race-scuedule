import type { IPlaceEntity } from '../entity/iPlaceEntity';

/**
 * 開催場所一覧取得レスポンス
 */
export class FetchPlaceListResponse<P extends IPlaceEntity<P>> {
    constructor(public readonly placeEntityList: P[]) {}
}
