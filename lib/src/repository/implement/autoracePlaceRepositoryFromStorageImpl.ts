import 'reflect-metadata';
import '../../utility/format';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { AutoracePlaceRecord } from '../../gateway/record/autoracePlaceRecord';
import {
    AutoraceGradeType,
    AutoraceRaceCourse,
} from '../../utility/data/autorace';
import { Logger } from '../../utility/logger';
import { AutoracePlaceId } from '../../utility/raceId';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * ボートレースデータリポジトリの実装
 */
@injectable()
export class AutoracePlaceRepositoryFromStorageImpl
    implements IPlaceRepository<AutoracePlaceEntity>
{
    constructor(
        @inject('AutoracePlaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<AutoracePlaceRecord>,
    ) {}
    /**
     * ボートレース開催データを取得する
     *
     * このメソッドで日付の範囲を指定してボートレース開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<AutoracePlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<AutoracePlaceEntity>> {
        const fileNames: string[] = await this.generateFileNames(
            request.startDate,
            request.finishDate,
        );

        // ファイル名リストからボートレース開催データを取得する
        const placeRecordList: AutoracePlaceRecord[] = (
            await Promise.all(
                fileNames.map(async (fileName) =>
                    this.fetchMonthPlaceRecordList(fileName),
                ),
            )
        ).flat();

        // AutoracePlaceRecordをAutoracePlaceEntityに変換
        const placeEntityList: AutoracePlaceEntity[] = placeRecordList
            .map(
                (placeRecord) =>
                    new AutoracePlaceEntity(
                        placeRecord.id,
                        new AutoracePlaceData(
                            placeRecord.dateTime,
                            placeRecord.location,
                            placeRecord.grade,
                        ),
                    ),
            )
            // 日付の範囲でフィルタリング
            .filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= request.startDate &&
                    placeEntity.placeData.dateTime <= request.finishDate,
            );
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
     * S3からボートレース開催データを取得する
     *
     * ファイル名を利用してS3からボートレース開催データを取得する
     * placeRecordが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param fileName
     * @returns
     */
    @Logger
    private async fetchMonthPlaceRecordList(
        fileName: string,
    ): Promise<AutoracePlaceRecord[]> {
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

        // データ行を解析してAutoracePlaceRecordのリストを生成
        const placeRecordList: AutoracePlaceRecord[] = lines
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

                return new AutoracePlaceRecord(
                    columns[idIndex] as AutoracePlaceId,
                    new Date(columns[raceDateIndex]),
                    columns[placeIndex] as AutoraceRaceCourse,
                    columns[gradeIndex] as AutoraceGradeType,
                );
            })
            .filter(
                (placeRecord): placeRecord is AutoracePlaceRecord =>
                    placeRecord !== undefined,
            );

        return placeRecordList;
    }

    @Logger
    async registerPlaceEntityList(
        request: RegisterPlaceListRequest<AutoracePlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        const placeEntityList: AutoracePlaceEntity[] = request.placeEntityList;
        // 得られたplaceを月毎に分ける
        const placeRecordDict: Record<string, AutoracePlaceRecord[]> = {};
        placeEntityList.forEach((placeEntity) => {
            const placeRecord = new AutoracePlaceRecord(
                placeEntity.id,
                placeEntity.placeData.dateTime,
                placeEntity.placeData.location,
                placeEntity.placeData.grade,
            );
            const key = `${format(placeRecord.dateTime, 'yyyyMM')}.csv`;
            if (!(key in placeRecordDict)) {
                placeRecordDict[key] = [];
            }
            placeRecordDict[key].push(placeRecord);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, placeRecord] of Object.entries(placeRecordDict)) {
            await this.s3Gateway.uploadDataToS3(placeRecord, fileName);
        }

        return new RegisterPlaceListResponse(200);
    }
}
