import type { PlaceEntity } from '../../repository/entity/baseEntity';

/**
 * IPlaceDataUseCase
 */
export interface IPlaceDataUseCase<P extends PlaceEntity> {
    /**
     * レース開催地のデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlaceEntityList: (startDate: Date, finishDate: Date) => Promise<P[]>;
    /**
     * レース開催地のデータを更新する
     * @param startDate
     * @param finishDate
     */
    updatePlaceEntityList: (startDate: Date, finishDate: Date) => Promise<void>;
}
