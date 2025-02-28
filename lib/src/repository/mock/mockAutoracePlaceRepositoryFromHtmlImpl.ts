import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

// AutoraceRaceRepositoryFromHtmlImplのモックを作成
export class MockAutoracePlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<AutoracePlaceEntity>
{
    /**
     * オートレース場データを取得する
     * @param searchFilter
     */
    @Logger
    fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<AutoracePlaceEntity[]> {
        // request.startDateからrequest.finishDateまでのオートレース場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
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
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param placeEntityList
     */
    @Logger
    registerPlaceEntityList(
        placeEntityList: AutoracePlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
