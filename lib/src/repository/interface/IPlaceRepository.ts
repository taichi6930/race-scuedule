import type { IPlaceEntity } from '../entity/iPlaceEntity';
import type { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';

/**
 * 開催データリポジトリ
 * @param <P> 開催データ
 */
export interface IPlaceRepository<P extends IPlaceEntity<P>> {
    /**
     * 開催データを取得する
     * @param request
     * @returns 開催データ
     */
    fetchPlaceEntityList: (
        searchFilter: SearchPlaceFilterEntity,
    ) => Promise<P[]>;

    /**
     * 開催データを登録する
     * @param request
     */
    registerPlaceEntityList: (placeEntityList: P[]) => Promise<void>;
}
