import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { JraRaceCourse } from '../../utility/data/jra';
import { Logger } from '../../utility/logger';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

@injectable()
export class JraPlaceRepositoryFromS3Impl
    implements IPlaceRepository<JraPlaceEntity>
{
    constructor(
        @inject('JraPlaceS3Gateway')
        private s3Gateway: IS3Gateway<JraPlaceEntity>,
    ) {}
    /**
     * 競馬場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競馬場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<JraPlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<JraPlaceEntity>> {
        const fileNames: string[] = await this.generateFileNames(
            request.startDate,
            request.finishDate,
        );
        const promises = fileNames.map((fileName) =>
            this.fetchYearPlaceDataList(fileName).then((childPlaceDataList) =>
                childPlaceDataList.filter(
                    (placeData) =>
                        placeData.dateTime >= request.startDate &&
                        placeData.dateTime <= request.finishDate,
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
            const fileName = `${year.toString()}.csv`;
            fileNames.push(fileName);

            // 次の月の1日を取得
            currentDate = new Date(year + 1, 0, 1);
        }
        console.debug(
            `ファイル名リストを生成しました: ${fileNames.join(', ')}`,
        );
        return Promise.resolve(fileNames);
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
    ): Promise<JraPlaceEntity[]> {
        console.log(`S3から${fileName}を取得します`);
        const csv = await this.s3Gateway.fetchDataFromS3(fileName);
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const idIndex = headers.indexOf('id');
        const raceDateIndex = headers.indexOf('dateTime');
        const placeIndex = headers.indexOf('location');
        const heldTimesIndex = headers.indexOf('heldTimes');
        const heldDayTimesIndex = headers.indexOf('heldDayTimes');

        // データ行を解析してJraPlaceEntityのリストを生成
        const placeEntityList: JraPlaceEntity[] = lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (!columns[raceDateIndex] || !columns[placeIndex]) {
                    return undefined;
                }

                // idIndexが存在しない場合はundefinedを返す
                return new JraPlaceEntity(
                    // TODO: idIndexが存在しない場合はnullを返すようにしているが、どこかのタイミングでエラーを出すように変更する
                    idIndex < 0 ? null : columns[idIndex],
                    new Date(columns[raceDateIndex]),
                    columns[placeIndex] as JraRaceCourse,
                    parseInt(columns[heldTimesIndex]),
                    parseInt(columns[heldDayTimesIndex]),
                );
            })
            .filter(
                (placeEntity): placeEntity is JraPlaceEntity =>
                    placeEntity !== undefined,
            );

        return placeEntityList;
    }

    @Logger
    async registerPlaceList(
        request: RegisterPlaceListRequest<JraPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        const placeData: JraPlaceEntity[] = request.placeDataList;
        // 得られたplaceを年毎に分ける
        const placeDataDict: Record<string, JraPlaceEntity[]> = {};
        placeData.forEach((place) => {
            const key = `${place.dateTime.getFullYear().toString()}.csv`;
            if (!(key in placeDataDict)) {
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
