import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

// KeirinRaceRepositoryFromHtmlImplのモックを作成
export class MockKeirinPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<KeirinPlaceEntity>
{
    /**
     * 競輪場データを取得する
     * @param request
     */
    @Logger
    fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<KeirinPlaceEntity>> {
        // request.startDateからrequest.finishDateまでの競輪場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(request.startDate);

        while (currentDate <= request.finishDate) {
            // 競輪場データを作成
            const keirinPlaceEntity = KeirinPlaceEntity.createWithoutId(
                KeirinPlaceData.create(new Date(currentDate), '川崎', 'GⅠ'),
                getJSTDate(new Date()),
            );
            fetchPlaceEntityList.push(keirinPlaceEntity);
            // 日付を1日進める
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return Promise.resolve(
            new FetchPlaceListResponse(fetchPlaceEntityList),
        );
    }

    /**
     * 競輪場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceEntityList(
        request: RegisterPlaceListRequest<KeirinPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
