/* eslint-disable */
import { injectable } from 'tsyringe';
import { IS3Gateway } from '../interface/iS3Gateway';
import { format } from 'date-fns';
import { Logger } from '../../utility/logger';
import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';
import { ENV } from '../../utility/env';

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
     */
    private static mockStorage: Map<string, string> = new Map<string, string>();

    /**
     * バケット名 S3の中にあるデータの保存場所
     *
     * @private
     * @type {string}
     */
    private bucketName: string;
    /**
     * フォルダのパス
     *
     * @private
     * @type {string}
     */
    private folderPath: string;

    /**
     * MockS3Gatewayのコンストラクタ
     * @param {string} bucketName
     * @param {string} folderPath
     */
    constructor(bucketName: string, folderPath: string) {
        this.bucketName = bucketName;
        this.folderPath = folderPath;

        // 既にmockStorageに値が入っている場合は何もしない
        if (MockS3Gateway.mockStorage.size > 0) {
            return;
        }
        // 最初にmockStorageに値を入れておく
        // 2024年のデータ366日分を作成
        for (let i = 0; i < 366; i++) {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + i);
            const fileName = `nar/race/${format(date, 'yyyyMMdd')}.csv`;
            for (let j = 1; j <= 12; j++) {
                MockS3Gateway.mockStorage.set(
                    fileName,
                    [
                        `name,dateTime,location,surfaceType,distance,grade,number\n`,
                        `NARテストレース,${format(date, 'yyyy-MM-dd')} ${j + 6}:00,高知,ダート,1200,GⅠ,${j}`,
                    ].join(''),
                );
            }
        }
        // 2024年のデータ12ヶ月分を作成
        for (let i = 1; i <= 12; i++) {
            const sdate = new Date(2024, i - 1, 1);
            const fileName = `nar/place/${format(sdate, 'yyyyMM')}.csv`;
            const mockData = ['dateTime,location\n', ,];
            // 1ヶ月分のデータ（28~31日）を作成
            for (let j = 1; j <= 31; j++) {
                const date = new Date(2024, i - 1, j);
                // もし_dateの月とdateの月が違う場合はbreak
                if (sdate.getMonth() !== date.getMonth()) {
                    break;
                }
                mockData.push(`${format(date, 'yyyy-MM-dd')},高知\n`);
            }
            MockS3Gateway.mockStorage.set(fileName, mockData.join(''));
        }
        // 2024年のデータ366日分を作成
        for (let i = 0; i < 366; i++) {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + i);
            const fileName = `jra/race/${format(date, 'yyyyMMdd')}.csv`;
            for (let j = 1; j <= 12; j++) {
                MockS3Gateway.mockStorage.set(
                    fileName,
                    [
                        `name,dateTime,location,surfaceType,distance,grade,number,heldTimes,heldDayTimes\n`,
                        `JRAテストレース,${format(date, 'yyyy-MM-dd')} ${j + 6}:00,東京,芝,2400,GⅠ,${j}`,
                    ].join(''),
                );
            }
        }
        // 2024年のデータ12ヶ月分を作成
        for (let i = 1; i <= 12; i++) {
            const sdate = new Date(2024, i - 1, 1);
            const fileName = `jra/place/${format(sdate, 'yyyyMM')}.csv`;
            const mockData = ['dateTime,location\n', ,];
            // 1ヶ月分のデータ（28~31日）を作成
            for (let j = 1; j <= 31; j++) {
                const date = new Date(2024, i - 1, j);
                // もし_dateの月とdateの月が違う場合はbreak
                if (sdate.getMonth() !== date.getMonth()) {
                    break;
                }
                mockData.push(`${format(date, 'yyyy-MM-dd')},東京\n`);
            }
            MockS3Gateway.mockStorage.set(fileName, mockData.join(''));
        }
        this.setKeirinRaceMockData();
        this.setKeirinPlaceMockData();
    }

    @Logger
    private setKeirinRaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
                // 2024年のデータ366日分を作成
                const startDate = new Date('2024-01-01');
                const currentDate = new Date(startDate);
                // whileで回していって、最初の日付の年数と異なったら終了
                while (currentDate.getFullYear() === startDate.getFullYear()) {
                    const fileName = `keirin/race/${format(currentDate, 'yyyyMMdd')}.csv`;
                    const mockDataHeader = [
                        'name',
                        'stage',
                        'dateTime',
                        'location',
                        'grade',
                        'number',
                        'id',
                    ].join(',');
                    const mockData = [mockDataHeader];
                    for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                        mockData.push(
                            [
                                `KEIRINグランプリ`,
                                `グランプリ`,
                                `${format(currentDate, 'yyyy-MM-dd')} ${raceNumber + 6}:00`,
                                '川崎',
                                'GP',
                                raceNumber,
                                `keirin${format(currentDate, 'yyyyMMdd')}${KEIRIN_PLACE_CODE['川崎']}${raceNumber.toXDigits(2)}`,
                            ].join(','),
                        );
                    }
                    MockS3Gateway.mockStorage.set(
                        fileName,
                        mockData.join('\n'),
                    );
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                break;
        }
    }

    @Logger
    private setKeirinPlaceMockData() {
        switch (ENV) {
            case 'ITa':
                break;
            default:
                // 2024年のデータ12ヶ月分を作成
                for (let month = 1; month <= 12; month++) {
                    const startDate = new Date(2024, month - 1, 1);
                    const fileName = `keirin/place/${format(startDate, 'yyyyMM')}.csv`;
                    const mockDataHeader = [
                        'id',
                        'dateTime',
                        'location',
                        'grade',
                    ].join(',');
                    const mockData = [mockDataHeader];
                    // 1ヶ月分のデータ（28~31日）を作成
                    // 2024年のデータ366日分を作成
                    const currentDate = new Date(startDate);
                    // whileで回していって、最初の日付の年数と異なったら終了
                    while (currentDate.getMonth() === startDate.getMonth()) {
                        mockData.push(
                            [
                                `keirin${format(currentDate, 'yyyyMMdd')}${KEIRIN_PLACE_CODE['川崎']}`,
                                format(currentDate, 'yyyy-MM-dd'),
                                '川崎',
                                'GP',
                            ].join(','),
                        );
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    MockS3Gateway.mockStorage.set(
                        fileName,
                        mockData.join('\n'),
                    );
                }
                break;
        }
    }

    /**
     * モックのデータをS3にアップロードする
     *
     * @param data
     * @param fileName
     */
    @Logger
    async uploadDataToS3(data: T[], fileName: string): Promise<void> {
        try {
            const csvContent = this.convertToCsv(data);
            const key = `${this.folderPath}${fileName}`;
            MockS3Gateway.mockStorage.set(key, csvContent);
        } catch (error) {
            console.debug(error);
            throw new Error('モックのファイルのアップロードに失敗しました');
        }
    }

    /**
     * モックのデータをS3から取得する
     *
     * @param fileName
     * @returns
     */
    @Logger
    async fetchDataFromS3(fileName: string): Promise<string> {
        const key = `${this.folderPath}${fileName}`;
        const data = MockS3Gateway.mockStorage.get(key);
        if (!data) {
            console.warn(`モックのファイルが存在しません: ${key}`);
            return '';
        }
        console.log(`モックのファイルを取得しました: ${key}`);
        return data;
    }

    /**
     * オブジェクトデータをCSV形式に変換する
     *
     * @private
     * @param {T[]} data
     * @returns {string}
     */
    @Logger
    private convertToCsv(data: T[]): string {
        if (data.length === 0) return '';

        const keys = Object.keys(data[0]);
        const csvHeader = keys.join(',') + '\n';
        const csvRows = data
            .map((item) => keys.map((key) => (item as any)[key]).join(','))
            .join('\n');

        return `${csvHeader}${csvRows}`;
    }
}
