/**
 * Interface for S3Gateway
 */
export interface IS3Gateway<T> {
    /**
     * S3にデータをアップロードする
     * @param data
     * @param fileName
     */
    uploadDataToS3(data: T[], fileName: string): Promise<void>;
    /**
     * S3からデータを取得する
     * @param fileName
     */
    fetchDataFromS3(fileName: string): Promise<string>;
    /**
     * S3からファイルの最終更新日時を取得する
     * @param fileName
     */
    getFileLastModified(fileName: string): Promise<Date | undefined>;
}