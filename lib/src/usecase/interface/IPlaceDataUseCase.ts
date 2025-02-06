import type { IPlaceData } from '../../domain/iPlaceData';

/**
 * IPlaceDataUseCase
 */
export interface IPlaceDataUseCase<P extends IPlaceData<P>> {
    /**
     * レース開催地のデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlaceDataList: (startDate: Date, finishDate: Date) => Promise<P[]>;
    /**
     * レース開催地のデータを更新する
     * @param startDate
     * @param finishDate
     */
    updatePlaceDataList: (startDate: Date, finishDate: Date) => Promise<void>;
}
