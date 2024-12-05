import type { PlaceEntity, RaceEntity } from '../entity/baseEntity';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import type { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import type { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * レースデータリポジトリ
 * @param <R> レースデータ
 * @param <P> 開催データ
 */
export interface IRaceRepository<R extends RaceEntity, P extends PlaceEntity> {
    /**
     * 開催データを取得する
     * @param request
     * @returns レースデータ
     */
    fetchRaceList: (
        request: FetchRaceListRequest<P>,
    ) => Promise<FetchRaceListResponse<R>>;
    /**
     * レースデータを登録する
     * @param request
     */
    registerRaceList: (
        request: RegisterRaceListRequest<R>,
    ) => Promise<RegisterRaceListResponse>;
}
