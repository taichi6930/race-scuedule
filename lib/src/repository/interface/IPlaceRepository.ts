import type { IPlaceEntity } from '../entity/iPlaceEntity';
import type { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import type { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import type { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

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
    fetchPlaceEntityList: (request: FetchPlaceListRequest) => Promise<P[]>;

    /**
     * 開催データを登録する
     * @param request
     */
    registerPlaceEntityList: (
        request: RegisterPlaceListRequest<P>,
    ) => Promise<RegisterPlaceListResponse>;
}
