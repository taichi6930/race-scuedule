import 'reflect-metadata';
import '../../utility/format';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import {
    AutoraceGradeType,
    AutoraceRaceCourse,
} from '../../utility/data/autorace';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * オートレースデータリポジトリの実装
 */
@injectable()
export class AutoracePlaceRepositoryFromStorageImpl
    implements IPlaceRepository<AutoracePlaceEntity>
{
    constructor(
        @inject('AutoracePlaceStorageGateway')
        private readonly s3Gateway: IS3Gateway<AutoracePlaceEntity>,
    ) {}
    /**
     * オートレース開催データを取得する
     *
     * このメソッドで日付の範囲を指定してオートレース開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<AutoracePlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<AutoracePlaceEntity>> {
        const fileNames: string[] = await this.generateFileNames(
            request.startDate,
            request.finishDate,
        );
        const promises = fileNames.map(async (fileName) =>
            this.fetchMonthPlaceEntityList(fileName).then(
                (childPlaceEntityList) =>
                    childPlaceEntityList.filter(
                        (placeEntity) =>
                            placeEntity.dateTime >= request.startDate &&
                            placeEntity.dateTime <= request.finishDate,
                    ),
            ),
        );
        const placeEntityLists = await Promise.all(promises);
        const placeEntityList = placeEntityLists.flat();
        return new FetchPlaceListResponse(placeEntityList);
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
     * S3からオートレース開催データを取得する
     *
     * ファイル名を利用してS3からオートレース開催データを取得する
     * placeEntityが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param fileName
     * @returns
     */
    @Logger
    private async fetchMonthPlaceEntityList(
        fileName: string,
    ): Promise<AutoracePlaceEntity[]> {
        console.log(`S3から${fileName}を取得します`);
        const csv = await this.s3Gateway.fetchDataFromS3(fileName);
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const idIndex = headers.indexOf('id');
        const raceDateIndex = headers.indexOf('dateTime');
        const placeIndex = headers.indexOf('location');
        const gradeIndex = headers.indexOf('grade');

        // データ行を解析してAutoracePlaceEntityのリストを生成
        const placeEntityList: AutoracePlaceEntity[] = lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[idIndex] ||
                    !columns[raceDateIndex] ||
                    !columns[placeIndex] ||
                    !columns[gradeIndex]
                ) {
                    return undefined;
                }

                return new AutoracePlaceEntity(
                    columns[idIndex],
                    new Date(columns[raceDateIndex]),
                    columns[placeIndex] as AutoraceRaceCourse,
                    columns[gradeIndex] as AutoraceGradeType,
                );
            })
            .filter(
                (placeEntity): placeEntity is AutoracePlaceEntity =>
                    placeEntity !== undefined,
            );

        return placeEntityList;
    }

    @Logger
    async registerPlaceList(
        request: RegisterPlaceListRequest<AutoracePlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        const placeEntityList: AutoracePlaceEntity[] = request.placeDataList;
        // 得られたplaceを月毎に分ける
        const placeDataDict: Record<string, AutoracePlaceEntity[]> = {};
        placeEntityList.forEach((placeData) => {
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
