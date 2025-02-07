import type { IPlaceEntity } from '../entity/iPlaceEntity';
import type { IRaceEntity } from '../entity/iRaceEntity';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import type { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import type { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * レースデータリポジトリ
 * @param <R> レースデータ
 * @param <P> 開催データ
 */
export interface IRaceRepository<
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
> {
    /**
     * 開催データを取得する
     * @param request
     * @returns レースデータ
     */
    fetchRaceEntityList: (
        request: FetchRaceListRequest<P>,
    ) => Promise<FetchRaceListResponse<R>>;
    /**
     * レースデータを登録する
     * @param request
     */
    registerRaceEntityList: (
        request: RegisterRaceListRequest<R>,
    ) => Promise<RegisterRaceListResponse>;
}
