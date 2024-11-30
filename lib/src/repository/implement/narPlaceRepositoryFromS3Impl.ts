import 'reflect-metadata';
import '../../utility/format';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { NarRaceCourse } from '../../utility/data/nar';
import { Logger } from '../../utility/logger';
import { NarPlaceId } from '../../utility/raceId';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * 競馬場データリポジトリの実装
 */
@injectable()
export class NarPlaceRepositoryFromS3Impl
    implements IPlaceRepository<NarPlaceEntity>
{
    constructor(
        @inject('NarPlaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<NarPlaceEntity>,
    ) {}
    /**
     * 競馬場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競馬場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<NarPlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<NarPlaceEntity>> {
        const fileNames: string[] = await this.generateFileNames(
            request.startDate,
            request.finishDate,
        );
        const promises = fileNames.map(async (fileName) =>
            this.fetchMonthPlaceDataList(fileName).then((childPlaceDataList) =>
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
            const fileName = `${format(currentDate, 'yyyyMM')}.csv`;
            fileNames.push(fileName);

            // 次の月の1日を取得
            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1,
            );
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
    private async fetchMonthPlaceDataList(
        fileName: string,
    ): Promise<NarPlaceEntity[]> {
        console.log(`S3から${fileName}を取得します`);
        const csv = await this.s3Gateway.fetchDataFromS3(fileName);
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const idIndex = headers.indexOf('id');
        const raceDateIndex = headers.indexOf('dateTime');
        const placeIndex = headers.indexOf('location');

        // データ行を解析してJraPlaceEntityのリストを生成
        const placeEntityList: NarPlaceEntity[] = lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (!columns[raceDateIndex] || !columns[placeIndex]) {
                    return undefined;
                }

                // idIndexが存在しない場合はundefinedを返す
                return new NarPlaceEntity(
                    // TODO: idIndexが存在しない場合はnullを返すようにしているが、どこかのタイミングでエラーを出すように変更する
                    columns[idIndex] as NarPlaceId,
                    new Date(columns[raceDateIndex]),
                    columns[placeIndex] as NarRaceCourse,
                );
            })
            .filter(
                (placeEntity): placeEntity is NarPlaceEntity =>
                    placeEntity !== undefined,
            );

        return placeEntityList;
    }

    @Logger
    async registerPlaceList(
        request: RegisterPlaceListRequest<NarPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        const placeDataList: NarPlaceEntity[] = request.placeDataList;
        // 得られたplaceを月毎に分ける
        const placeDataDict: Record<string, NarPlaceEntity[]> = {};
        placeDataList.forEach((placeData) => {
            const key = `${format(placeData.dateTime, 'yyyyMM')}.csv`;
            if (!(key in placeDataDict)) {
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
