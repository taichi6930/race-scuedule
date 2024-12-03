import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { NarPlaceData } from '../../domain/narPlaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { NarPlaceRecord } from '../../gateway/record/narPlaceRecord';
import { NarRaceCourse } from '../../utility/data/nar';
import { Logger } from '../../utility/logger';
import { NarPlaceId } from '../../utility/raceId';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

@injectable()
export class NarPlaceRepositoryFromS3Impl
    implements IPlaceRepository<NarPlaceEntity>
{
    constructor(
        @inject('NarPlaceS3Gateway')
        private s3Gateway: IS3Gateway<NarPlaceRecord>,
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

        // 年ごとの競馬場開催データを取得
        const placeRecords = (
            await Promise.all(
                fileNames.map((fileName) =>
                    this.fetchYearPlaceRecordList(fileName),
                ),
            )
        ).flat();

        // Entityに変換
        const placeEntityList: NarPlaceEntity[] = placeRecords.map(
            (placeRecord) => {
                return new NarPlaceEntity(
                    placeRecord.id,
                    new NarPlaceData(
                        placeRecord.dateTime,
                        placeRecord.location,
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
    ): Promise<NarPlaceRecord[]> {
        console.log(`S3から${fileName}を取得します`);
        const csv = await this.s3Gateway.fetchDataFromS3(fileName);
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const idIndex = headers.indexOf('id');
        const raceDateIndex = headers.indexOf('dateTime');
        const placeIndex = headers.indexOf('location');

        // データ行を解析してNarPlaceRecordのリストを生成
        const placeRecordList: NarPlaceRecord[] = lines
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
                return new NarPlaceRecord(
                    columns[idIndex] as NarPlaceId,
                    new Date(columns[raceDateIndex]),
                    columns[placeIndex] as NarRaceCourse,
                );
            })
            .filter(
                (placeRecord): placeRecord is NarPlaceRecord =>
                    placeRecord !== undefined,
            );

        return placeRecordList;
    }

    @Logger
    async registerPlaceList(
        request: RegisterPlaceListRequest<NarPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        const placeEntity: NarPlaceEntity[] = request.placeDataList;
        // 得られたplaceを年毎に分ける
        const placeRecordDict: Record<string, NarPlaceRecord[]> = {};
        placeEntity.forEach((place) => {
            const key = `${place.placeData.dateTime.getFullYear().toString()}.csv`;
            if (!(key in placeRecordDict)) {
                placeRecordDict[key] = [];
            }
            placeRecordDict[key].push(
                new NarPlaceRecord(
                    place.id,
                    place.placeData.dateTime,
                    place.placeData.location,
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
