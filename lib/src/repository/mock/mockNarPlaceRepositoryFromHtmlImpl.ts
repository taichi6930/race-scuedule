import { NarPlaceData } from '../../domain/narPlaceData';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

// NarRaceRepositoryFromHtmlImplのモックを作成
export class MockNarPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<NarPlaceEntity>
{
    /**
     * 地方競馬場データを取得する
     * @param request
     */
    @Logger
    fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<NarPlaceEntity>> {
        // request.startDateからrequest.finishDateまでの地方競馬場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(request.startDate);

        while (currentDate <= request.finishDate) {
            // 地方競馬場データを作成
            const narPlaceEntity = new NarPlaceEntity(
                null,
                new NarPlaceData(new Date(currentDate), '大井'),
            );
            fetchPlaceEntityList.push(narPlaceEntity);
            // 日付を1日進める
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return Promise.resolve(
            new FetchPlaceListResponse(fetchPlaceEntityList),
        );
    }

    /**
     * 競馬場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceEntityList(
        request: RegisterPlaceListRequest<NarPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
