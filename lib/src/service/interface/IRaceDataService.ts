import type {
    PlaceEntity,
    RaceEntity,
} from '../../repository/entity/baseEntity';

/**
 * IRaceDataService
 */
export interface IRaceDataService<R extends RaceEntity, P extends PlaceEntity> {
    /**
     * レース開催のデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchRaceEntityList: (
        startDate: Date,
        finishDate: Date,
        type: 'storage' | 'web',
        placeEntityList?: P[],
    ) => Promise<R[]>;

    /**
     * レース開催のデータを更新する
     * @param startDate
     * @param finishDate
     */
    updateRaceEntityList: (raceEntityList: R[]) => Promise<void>;
}
