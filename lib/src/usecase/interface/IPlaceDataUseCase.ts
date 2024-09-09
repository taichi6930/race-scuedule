/**
 * IPlaceDataUseCase
 */
export interface IPlaceDataUseCase<P> {
    /**
     * レース開催地のデータを取得する
     * @param startDate
     * @param finishDate
     */
    getPlaceDataList(startDate: Date, finishDate: Date): Promise<P[]>;
    /**
     * レース開催地のデータを更新する
     * @param startDate
     * @param finishDate
     */
    updatePlaceDataList(startDate: Date, finishDate: Date): Promise<void>;
}
