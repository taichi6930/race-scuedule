import type { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import type { DataLocationType } from '../../utility/dataType';

/**
 * IPlaceDataService
 */
export interface IPlaceDataService<P extends IPlaceEntity<P>> {
    /**
     * 開催場データを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlaceEntityList: (
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
    ) => Promise<P[]>;

    /**
     * 開催場データを更新する
     * @param startDate
     * @param finishDate
     */
    updatePlaceEntityList: (placeEntityList: P[]) => Promise<void>;
}
