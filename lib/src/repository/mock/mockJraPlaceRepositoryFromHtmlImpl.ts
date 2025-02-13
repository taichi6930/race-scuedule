import { JraPlaceData } from '../../domain/jraPlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

// JraRaceRepositoryFromHtmlImplのモックを作成
export class MockJraPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    /**
     * 中央競馬場データを取得する
     * @param request
     */
    @Logger
    fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<JraPlaceEntity[]> {
        // request.startDateからrequest.finishDateまでの中央競馬場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(request.startDate);

        while (currentDate <= request.finishDate) {
            // 中央競馬場データを作成
            const jraPlaceEntity = JraPlaceEntity.createWithoutId(
                JraPlaceData.create(new Date(currentDate), '東京', 1, 1),
                getJSTDate(new Date()),
            );
            fetchPlaceEntityList.push(jraPlaceEntity);
            // 日付を1日進める
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return Promise.resolve(fetchPlaceEntityList);
    }

    /**
     * 競馬場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceEntityList(
        placeEntityList: JraPlaceEntity[],
    ): Promise<RegisterPlaceListResponse> {
        console.debug(placeEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
