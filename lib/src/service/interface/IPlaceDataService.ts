import type { PlaceEntity } from '../../repository/entity/baseEntity';

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
        type: 'storage' | 'web',
    ) => Promise<P[]>;

    /**
     * レース開催地のデータを更新する
     * @param startDate
     * @param finishDate
     */
    updatePlaceEntityList: (placeEntityList: P[]) => Promise<void>;
}
