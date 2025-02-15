import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

// BoatraceRaceRepositoryFromHtmlImplのモックを作成
export class MockBoatracePlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<BoatracePlaceEntity>
{
    /**
     * ボートレース場データを取得する
     * @param request
     */
    @Logger
    fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<BoatracePlaceEntity[]> {
        // request.startDateからrequest.finishDateまでのボートレース場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            // ボートレース場データを作成
            const boatracePlaceEntity = BoatracePlaceEntity.createWithoutId(
                BoatracePlaceData.create(new Date(currentDate), '平和島', 'SG'),
                getJSTDate(new Date()),
            );
            fetchPlaceEntityList.push(boatracePlaceEntity);
            // 日付を1日進める
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return Promise.resolve(fetchPlaceEntityList);
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceEntityList(
        placeEntityList: BoatracePlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
