import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

// AutoraceRaceRepositoryFromHtmlImplのモックを作成
export class MockAutoracePlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<AutoracePlaceEntity>
{
    /**
     * オートレース場データを取得する
     * @param request
     */
    @Logger
    fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<AutoracePlaceEntity>> {
        // request.startDateからrequest.finishDateまでのオートレース場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(request.startDate);

        while (currentDate <= request.finishDate) {
            // オートレース場データを作成
            const autoracePlaceEntity = new AutoracePlaceEntity(
                null,
                new Date(currentDate),
                '伊勢崎',
                'SG',
            );
            fetchPlaceEntityList.push(autoracePlaceEntity);
            // 日付を1日進める
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return Promise.resolve(
            new FetchPlaceListResponse(fetchPlaceEntityList),
        );
    }

    /**
     * オートレース場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceList(
        request: RegisterPlaceListRequest<AutoracePlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
