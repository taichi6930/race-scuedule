import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
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
    fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<AutoracePlaceEntity[]> {
        // request.startDateからrequest.finishDateまでのオートレース場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(request.startDate);

        while (currentDate <= request.finishDate) {
            const datetime = new Date(currentDate);
            const place = '伊勢崎';
            // オートレース場データを作成
            const autoracePlaceEntity = AutoracePlaceEntity.createWithoutId(
                AutoracePlaceData.create(datetime, place, 'SG'),
                getJSTDate(new Date()),
            );
            fetchPlaceEntityList.push(autoracePlaceEntity);
            // 日付を1日進める
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return Promise.resolve(fetchPlaceEntityList);
    }

    /**
     * オートレース場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceEntityList(
        placeEntityList: AutoracePlaceEntity[],
    ): Promise<RegisterPlaceListResponse> {
        console.debug(placeEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
