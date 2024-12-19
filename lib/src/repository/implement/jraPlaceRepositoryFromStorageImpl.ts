import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { JraPlaceRecord } from '../../gateway/record/jraPlaceRecord';
import { JraRaceCourse } from '../../utility/data/jra';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { JraPlaceId } from '../../utility/raceId';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

@injectable()
export class JraPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly fileName = 'placeList.csv';

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
    async fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<JraPlaceEntity>> {
        // 年ごとの競馬場開催データを取得
        const placeRecordList: JraPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // Entityに変換
        const placeEntityList: JraPlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // filterで日付の範囲を指定
        const filteredPlaceEntityList = placeEntityList.filter(
            (placeEntity) =>
                placeEntity.placeData.dateTime >= request.startDate &&
                placeEntity.placeData.dateTime <= request.finishDate,
        );

        return new FetchPlaceListResponse(filteredPlaceEntityList);
    }

    @Logger
    async registerPlaceEntityList(
        request: RegisterPlaceListRequest<JraPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchPlaceRecordList: JraPlaceRecord[] =
            await this.getPlaceRecordListFromS3();

        // PlaceEntityをPlaceRecordに変換する
        const placeRecordList: JraPlaceRecord[] = request.placeEntityList.map(
            (placeEntity) => placeEntity.toRecord(),
        );

        // idが重複しているデータは上書きをし、新規のデータは追加する
        placeRecordList.forEach((placeRecord) => {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchPlaceRecordList.findIndex(
                (record) => record.id === placeRecord.id,
            );
            if (index !== -1) {
                existFetchPlaceRecordList[index] = placeRecord;
            } else {
                existFetchPlaceRecordList.push(placeRecord);
            }
        });

        // 日付の最新順にソート
        existFetchPlaceRecordList.sort(
            (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
        );

        // placeをS3にアップロードする
        await this.s3Gateway.uploadDataToS3(
            existFetchPlaceRecordList,
            this.fileName,
        );

        return new RegisterPlaceListResponse(200);
    }

    /**
     * レースデータをS3から取得する
     * @param request
     */
    @Logger
    private async getPlaceRecordListFromS3(): Promise<JraPlaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(this.fileName);

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf('id'),
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            heldTimes: headers.indexOf('heldTimes'),
            heldDayTimes: headers.indexOf('heldDayTimes'),
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してPlaceDataのリストを生成
        const placeRecordList: JraPlaceRecord[] = lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[indices.id] ||
                    !columns[indices.dateTime] ||
                    !columns[indices.location]
                ) {
                    return undefined;
                }

                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                return new JraPlaceRecord(
                    columns[indices.id] as JraPlaceId,
                    new Date(columns[indices.dateTime]),
                    columns[indices.location] as JraRaceCourse,
                    parseInt(columns[indices.heldTimes]),
                    parseInt(columns[indices.heldDayTimes]),
                    updateDate,
                );
            })
            .filter(
                (placeData): placeData is JraPlaceRecord =>
                    placeData !== undefined,
            );

        return placeRecordList;
    }
}
