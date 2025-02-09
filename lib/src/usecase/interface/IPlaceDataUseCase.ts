import type { IPlaceData } from '../../domain/iPlaceData';

/**
 * IPlaceDataUseCase
 */
export interface IPlaceDataUseCase<P extends IPlaceData<P>> {
    /**
     * 開催場データを取得する
     * @param startDate
     * @param finishDate
     */
    fetchPlaceDataList: (startDate: Date, finishDate: Date) => Promise<P[]>;
    /**
     * 開催場データを更新する
     * @param startDate
     * @param finishDate
     */
    updatePlaceDataList: (startDate: Date, finishDate: Date) => Promise<void>;
}
