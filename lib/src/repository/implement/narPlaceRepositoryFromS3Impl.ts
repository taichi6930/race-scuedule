import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { NarPlaceData } from '../../domain/narPlaceData';
import { NarRaceCourse } from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';
import '../../utility/format';

/**
 * 競馬場データリポジトリの実装
 */
@injectable()
export class NarPlaceRepositoryFromS3Impl
    implements IPlaceRepository<NarPlaceData>
{
    constructor(
        @inject('NarPlaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<NarPlaceData>,
    ) {}
    /**
     * 競馬場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競馬場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<NarPlaceData>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<NarPlaceData>> {
        const fileNames: string[] = await this.generateFileNames(
            request.startDate,
            request.endDate,
        );
        const promises = fileNames.map(async (fileName) =>
            this.fetchMonthPlaceDataList(fileName).then((childPlaceDataList) =>
                childPlaceDataList.filter(
                    (placeData) =>
                        placeData.dateTime >= request.startDate &&
                        placeData.dateTime <= request.endDate,
                ),
            ),
        );
        const placeDataLists = await Promise.all(promises);
        const placeDataList = placeDataLists.flat();
        return new FetchPlaceListResponse(placeDataList);
    }

    /**
     * csvのファイル名リストを生成する
     *
     * startDateからfinishDateまでの月ごとのファイル名リストを生成する
     * 月毎のファイル名が欲しいので、複数のファイル名を返す
     *
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    private async generateFileNames(
        startDate: Date,
        finishDate: Date,
    ): Promise<string[]> {
        const fileNames: string[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            const year = currentDate.getFullYear();
            const month = currentDate.getXDigitMonth(2);
            const fileName = `${year}${month}.csv`;
            fileNames.push(fileName);

            // 次の月の1日を取得
            currentDate = new Date(year, currentDate.getMonth() + 1, 1);
        }
        console.debug(
            `ファイル名リストを生成しました: ${fileNames.join(', ')}`,
        );
        return fileNames;
    }

    /**
     * S3から競馬場開催データを取得する
     *
     * ファイル名を利用してS3から競馬場開催データを取得する
     * placeDataが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param fileName
     * @returns
     */
    @Logger
    private async fetchMonthPlaceDataList(
        fileName: string,
    ): Promise<NarPlaceData[]> {
        console.log(`S3から${fileName}を取得します`);
        const csv = await this.s3Gateway.fetchDataFromS3(fileName);
        const placeDataList: NarPlaceData[] = csv
            .split('\n')
            .map((line: string) => {
                const [raceDate, place] = line.split(',');
                return new NarPlaceData(
                    new Date(raceDate),
                    place as NarRaceCourse,
                );
            })
            .filter((placeData) => placeData !== undefined);
        return placeDataList;
    }

    @Logger
    async registerPlaceList(
        request: RegisterPlaceListRequest<NarPlaceData>,
    ): Promise<RegisterPlaceListResponse> {
        const placeDataList: NarPlaceData[] = request.placeDataList;
        // 得られたplaceを月毎に分ける
        const placeDataDict: Record<string, NarPlaceData[]> = {};
        placeDataList.forEach((placeData) => {
            const key = `${placeData.dateTime.getFullYear()}${placeData.dateTime.getXDigitMonth(2)}.csv`;
            if (!placeDataDict[key]) {
                placeDataDict[key] = [];
            }
            placeDataDict[key].push(placeData);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, placeData] of Object.entries(placeDataDict)) {
            await this.s3Gateway.uploadDataToS3(placeData, fileName);
        }

        return new RegisterPlaceListResponse(200);
    }
}
