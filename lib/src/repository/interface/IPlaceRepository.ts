import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * 競馬場データリポジトリ
 * @param <P> 競馬場データ
 */
export interface IPlaceRepository<P> {
    /**
     * 競馬場データを取得する
     * @param request リクエスト
     * @returns 競馬場データ
     */
    fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<P>>;

    /**
     * 競馬場データを登録する
     * @param placeDataList 競馬場データリスト
     * @param startDate 開始日
     */
    registerPlaceList(
        request: RegisterPlaceListRequest<P>,
    ): Promise<RegisterPlaceListResponse>;
}
