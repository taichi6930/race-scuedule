import { NarPlaceData } from '../../domain/narPlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { SearchFilterEntity } from '../entity/searchFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

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
        searchFilter: SearchFilterEntity,
    ): Promise<NarPlaceEntity[]> {
        // request.startDateからrequest.finishDateまでの地方競馬場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            // 地方競馬場データを作成
            const narPlaceEntity = NarPlaceEntity.createWithoutId(
                NarPlaceData.create(new Date(currentDate), '大井'),
                getJSTDate(new Date()),
            );
            fetchPlaceEntityList.push(narPlaceEntity);
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
    registerPlaceEntityList(placeEntityList: NarPlaceEntity[]): Promise<void> {
        console.debug(placeEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
