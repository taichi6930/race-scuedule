import type { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import type { IRaceEntity } from '../../repository/entity/iRaceEntity';
import type { DataLocationType } from '../../utility/dataType';

/**
 * IRaceDataService
 */
export interface IRaceDataService<
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
> {
    /**
     * レース開催のデータを取得する
     * @param startDate
     * @param finishDate
     * @param type
     * @param placeEntityList
     */
    fetchRaceEntityList: (
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
        placeEntityList?: P[],
    ) => Promise<R[]>;

    /**
     * レース開催のデータを更新する
     * @param raceEntityList
     */
    updateRaceEntityList: (raceEntityList: R[]) => Promise<void>;
}
