import { JraPlaceData } from '../../domain/jraPlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { SearchFilterEntity } from '../entity/searchFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

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
        searchFilter: SearchFilterEntity,
    ): Promise<JraPlaceEntity[]> {
        // request.startDateからrequest.finishDateまでの中央競馬場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
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
    registerPlaceEntityList(placeEntityList: JraPlaceEntity[]): Promise<void> {
        console.debug(placeEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
