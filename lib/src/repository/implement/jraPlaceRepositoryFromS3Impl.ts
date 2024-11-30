import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { JraPlaceRecord } from '../../gateway/record/jraPlaceRecord';
import { JraRaceCourse } from '../../utility/data/jra';
import { Logger } from '../../utility/logger';
import { JraPlaceId } from '../../utility/raceId';
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
        private s3Gateway: IS3Gateway<JraPlaceRecord>,
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

        // 年ごとの競馬場開催データを取得
        const placeRecords = (
            await Promise.all(
                fileNames.map((fileName) =>
                    this.fetchYearPlaceRecordList(fileName),
                ),
            )
        ).flat();

        // Entityに変換
        const placeEntityList: JraPlaceEntity[] = placeRecords.map(
            (placeRecord) => {
                return new JraPlaceEntity(
                    placeRecord.id,
                    new JraPlaceData(
                        placeRecord.dateTime,
                        placeRecord.location,
                        placeRecord.heldTimes,
                        placeRecord.heldDayTimes,
                    ),
                );
            },
        );

        // filterで日付の範囲を指定
        const filteredPlaceEntityList = placeEntityList.filter(
            (placeEntity) =>
                placeEntity.placeData.dateTime >= request.startDate &&
                placeEntity.placeData.dateTime <= request.finishDate,
        );

        return new FetchPlaceListResponse(filteredPlaceEntityList);
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
    private async fetchYearPlaceRecordList(
        fileName: string,
    ): Promise<JraPlaceRecord[]> {
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

        // データ行を解析してJraPlaceRecordのリストを生成
        const placeRecordList: JraPlaceRecord[] = lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[idIndex] ||
                    !columns[raceDateIndex] ||
                    !columns[placeIndex]
                ) {
                    return undefined;
                }

                // idIndexが存在しない場合はundefinedを返す
                return new JraPlaceRecord(
                    columns[idIndex] as JraPlaceId,
                    new Date(columns[raceDateIndex]),
                    columns[placeIndex] as JraRaceCourse,
                    parseInt(columns[heldTimesIndex]),
                    parseInt(columns[heldDayTimesIndex]),
                );
            })
            .filter(
                (placeRecord): placeRecord is JraPlaceRecord =>
                    placeRecord !== undefined,
            );

        return placeRecordList;
    }

    @Logger
    async registerPlaceList(
        request: RegisterPlaceListRequest<JraPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        const placeEntity: JraPlaceEntity[] = request.placeDataList;
        // 得られたplaceを年毎に分ける
        const placeRecordDict: Record<string, JraPlaceRecord[]> = {};
        placeEntity.forEach((place) => {
            const key = `${place.placeData.dateTime.getFullYear().toString()}.csv`;
            if (!(key in placeRecordDict)) {
                placeRecordDict[key] = [];
            }
            placeRecordDict[key].push(
                new JraPlaceRecord(
                    place.id,
                    place.placeData.dateTime,
                    place.placeData.location,
                    place.placeData.heldTimes,
                    place.placeData.heldDayTimes,
                ),
            );
        });

        // 年毎に分けられたplaceをS3にアップロードする
        for (const [fileName, placeRecord] of Object.entries(placeRecordDict)) {
            await this.s3Gateway.uploadDataToS3(placeRecord, fileName);
        }

        return new RegisterPlaceListResponse(200);
    }
}
