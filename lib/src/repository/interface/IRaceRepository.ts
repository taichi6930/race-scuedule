import type { IPlaceEntity } from '../entity/iPlaceEntity';
import type { IRaceEntity } from '../entity/iRaceEntity';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';

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
    fetchRaceEntityList: (request: FetchRaceListRequest<P>) => Promise<R[]>;
    /**
     * レースデータを登録する
     * @param request
     */
    registerRaceEntityList: (raceEntityList: R[]) => Promise<void>;
}
