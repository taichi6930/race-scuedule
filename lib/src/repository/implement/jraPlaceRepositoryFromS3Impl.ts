import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { JraRaceCourse } from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

@injectable()
export class JraPlaceRepositoryFromS3Impl
    implements IPlaceRepository<JraPlaceData>
{
    constructor(
        @inject('JraPlaceS3Gateway')
        private s3Gateway: IS3Gateway<JraPlaceData>,
    ) {}
    /**
     * 競馬場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競馬場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<JraPlaceData>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<JraPlaceData>> {
        const fileNames: string[] = this.generateFileNames(
            request.startDate,
            request.endDate,
        );
        const promises = fileNames.map((fileName) =>
            this.fetchYearPlaceDataList(fileName).then((childPlaceDataList) =>
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
    private generateFileNames(startDate: Date, finishDate: Date): string[] {
        const fileNames: string[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            const year = currentDate.getFullYear();
            const fileName = `${year}.csv`;
            fileNames.push(fileName);

            // 次の月の1日を取得
            currentDate = new Date(year + 1, 0, 1);
        }
        console.debug(`ファイル名リストを生成しました: ${fileNames}`);
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
    private async fetchYearPlaceDataList(
        fileName: string,
    ): Promise<JraPlaceData[]> {
        console.log(`S3から${fileName}を取得します`);
        const csv = await this.s3Gateway.fetchDataFromS3(fileName);
        const placeData: JraPlaceData[] = csv
            .split('\n')
            .map((line: string) => {
                const [raceDate, place] = line.split(',');
                return new JraPlaceData(
                    new Date(raceDate),
                    place as JraRaceCourse,
                );
            })
            .filter((placeData) => placeData !== undefined);
        return placeData;
    }

    @Logger
    async registerPlaceList(
        request: RegisterPlaceListRequest<JraPlaceData>,
    ): Promise<RegisterPlaceListResponse> {
        const placeData: JraPlaceData[] = request.placeDataList;
        // 得られたplaceを年毎に分ける
        const placeDataDict: Record<string, JraPlaceData[]> = {};
        placeData.forEach((place) => {
            const key = `${place.dateTime.getFullYear()}.csv`;
            if (!placeDataDict[key]) {
                placeDataDict[key] = [];
            }
            placeDataDict[key].push(place);
        });

        // 年毎に分けられたplaceをS3にアップロードする
        for (const [fileName, placeData] of Object.entries(placeDataDict)) {
            await this.s3Gateway.uploadDataToS3(placeData, fileName);
        }

        return new RegisterPlaceListResponse(200);
    }
}
