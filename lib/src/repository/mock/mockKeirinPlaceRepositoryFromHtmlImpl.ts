import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

// KeirinRaceRepositoryFromHtmlImplのモックを作成
export class MockKeirinPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<KeirinPlaceEntity>
{
    /**
     * 競輪場データを取得する
     * @param searchFilter
     */
    @Logger
    fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<KeirinPlaceEntity[]> {
        // request.startDateからrequest.finishDateまでの競輪場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            // 競輪場データを作成
            const keirinPlaceEntity = KeirinPlaceEntity.createWithoutId(
                KeirinPlaceData.create(new Date(currentDate), '川崎', 'GⅠ'),
                getJSTDate(new Date()),
            );
            fetchPlaceEntityList.push(keirinPlaceEntity);
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
        placeEntityList: KeirinPlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
