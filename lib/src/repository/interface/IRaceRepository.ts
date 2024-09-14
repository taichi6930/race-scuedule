import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import type { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import type { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリ
 * @param <R> 競馬場開催データ
 * @param <P> 競馬場データ
 */
export interface IRaceRepository<R, P> {
    /**
     * 競馬場開催データを取得する
     * @param request リクエスト
     * @returns 競馬場開催データ
     */
    fetchRaceList: (
        request: FetchRaceListRequest<P>,
    ) => Promise<FetchRaceListResponse<R>>;
    /**
     * レースデータを登録する
     * @param request リクエスト
     */
    registerRaceList: (
        request: RegisterRaceListRequest<R>,
    ) => Promise<RegisterRaceListResponse>;
}
