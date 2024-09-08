/**
 * レースデータUseCaseのインターフェース
 */
export interface IRaceDataUseCase {
    /**
     * レースデータのリストを更新する
     * @param startDate
     * @param finishDate
     */
    updateRaceDataList(startDate: Date, endDate: Date): Promise<void>;
}
