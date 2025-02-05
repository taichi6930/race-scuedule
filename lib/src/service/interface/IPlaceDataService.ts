import type { PlaceEntity } from '../../repository/entity/baseEntity';
import type { DataLocationType } from '../../utility/dataType';

/**
 * IPlaceDataService
 */
export interface IPlaceDataService<P extends PlaceEntity> {
    /**
     * レース開催地のデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlaceEntityList: (
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
    ) => Promise<P[]>;

    /**
     * レース開催地のデータを更新する
     * @param startDate
     * @param finishDate
     */
    updatePlaceEntityList: (placeEntityList: P[]) => Promise<void>;
}
