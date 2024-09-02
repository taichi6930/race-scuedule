import { injectable } from 'tsyringe';
import { IS3Gateway } from '../interface/iS3Gateway';

/**
 * MockS3Gateway
 */
@injectable()
export class MockS3Gateway<T extends object> implements IS3Gateway<T> {
    /**
     * モックデータを保存するためのマップ
     *
     * @private
     * @type {Map<string, string>}
     * @memberof MockS3Gateway
     */
    private mockStorage: Map<string, string>;

    /**
     * バケット名 S3の中にあるデータの保存場所
     *
     * @private
     * @type {string}
     * @memberof MockS3Gateway
     */
    private bucketName: string;
    /**
     * フォルダのパス
     *
     * @private
     * @type {string}
     * @memberof MockS3Gateway
     */
    private folderPath: string;

    /**
     * MockS3Gatewayのコンストラクタ
     * @param {string} bucketName
     * @param {string} folderPath
     * @memberof MockS3Gateway
     */
    constructor(bucketName: string, folderPath: string) {
        this.bucketName = bucketName;
        this.folderPath = folderPath;
        this.mockStorage = new Map<string, string>();
        // 最初にmockStorageに値を入れておく
        this.mockStorage.set('nar/race/20240901.csv', 'name,dateTime,location,surfaceType,distance,grade,number\nテストレース,2024-09-01,札幌,芝,1200,GⅠ,1');
    }

    /**
     * モックのデータをS3にアップロードする
     *
     * @param data
     * @param fileName
     */
    async uploadDataToS3(data: T[], fileName: string): Promise<void> {
        try {
            const csvContent = this.convertToCsv(data);
            const key = `${this.folderPath}${fileName}`;
            this.mockStorage.set(key, csvContent);
        } catch (error) {
            throw new Error('モックのファイルのアップロードに失敗しました');
        }
    }

    /**
     * モックのデータをS3から取得する
     *
     * @param fileName
     * @returns
     */
    async fetchDataFromS3(fileName: string): Promise<string> {
        const key = `${this.folderPath}${fileName}`;
        const data = this.mockStorage.get(key);
        if (!data) {
            console.warn('モックのファイルが存在しません');
            return '';
        }
        return data;
    }

    /**
     * オブジェクトデータをCSV形式に変換する
     *
     * @private
     * @param {T[]} data
     * @returns {string}
     */
    private convertToCsv(data: T[]): string {
        if (data.length === 0) return '';

        const keys = Object.keys(data[0]);
        const csvHeader = keys.join(',') + '\n';
        const csvRows = data.map(item => keys.map(key => (item as any)[key]).join(',')).join('\n');

        return csvHeader + csvRows;
    }
}
