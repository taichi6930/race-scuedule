/**
 * レースデータUseCaseのインターフェース
 */
export interface IRaceDataUseCase<R> {
    /**
     * レースデータを取得する
     * @param startDate
     * @param finishDate
    */
    fetchRaceDataList(startDate: Date, finishDate: Date): Promise<R[]>;
    /**
     * レースデータのリストを更新する
     * @param startDate
     * @param finishDate
     */
    updateRaceDataList(startDate: Date, endDate: Date): Promise<void>;
}
