import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { JraRaceRecord } from '../../gateway/record/jraRaceRecord';
import {
    JraGradeType,
    JraRaceCourse,
    JraRaceCourseType,
} from '../../utility/data/jra';
import { Logger } from '../../utility/logger';
import { JraRaceId } from '../../utility/raceId';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

@injectable()
export class JraRaceRepositoryFromStorageImpl
    implements IRaceRepository<JraRaceEntity, JraPlaceEntity>
{
    private readonly fileName = 'raceList.csv';

    constructor(
        @inject('JraRaceS3Gateway')
        private s3Gateway: IS3Gateway<JraRaceRecord>,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<JraPlaceEntity>,
    ): Promise<FetchRaceListResponse<JraRaceEntity>> {
        // ファイル名リストから海外競馬場開催データを取得する
        const raceRecordList: JraRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceRecordをRaceEntityに変換
        const newRaceEntityList: JraRaceEntity[] = raceRecordList.map(
            (raceRecord) => raceRecord.toEntity(),
        );

        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: JraRaceEntity[] =
            newRaceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= request.startDate &&
                    raceEntity.raceData.dateTime <= request.finishDate,
            );
        return new FetchRaceListResponse<JraRaceEntity>(filteredRaceEntityList);
    }

    /**
     * 新ファイルリストからレースデータを取得する
     */
    @Logger
    private async getRaceRecordListFromS3(): Promise<JraRaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.s3Gateway.fetchDataFromS3(this.fileName);

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].replace('\r', '').split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf('id'),
            name: headers.indexOf('name'),
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            surfaceType: headers.indexOf('surfaceType'),
            distance: headers.indexOf('distance'),
            grade: headers.indexOf('grade'),
            number: headers.indexOf('number'),
            heldTimes: headers.indexOf('heldTimes'),
            heldDayTimes: headers.indexOf('heldDayTimes'),
        };

        // データ行を解析してRaceDataのリストを生成
        return lines
            .slice(1)
            .map((line: string) => {
                const columns = line.replace('\r', '').split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[indices.name] ||
                    isNaN(parseInt(columns[indices.number]))
                ) {
                    return undefined;
                }

                return new JraRaceRecord(
                    columns[indices.id] as JraRaceId,
                    columns[indices.name],
                    new Date(columns[indices.dateTime]),
                    columns[indices.location] as JraRaceCourse,
                    columns[indices.surfaceType] as JraRaceCourseType,
                    parseInt(columns[indices.distance]),
                    columns[indices.grade] as JraGradeType,
                    parseInt(columns[indices.number]),
                    parseInt(columns[indices.heldTimes]),
                    parseInt(columns[indices.heldDayTimes]),
                );
            })
            .filter(
                (raceData): raceData is JraRaceRecord => raceData !== undefined,
            );
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceEntityList(
        request: RegisterRaceListRequest<JraRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: JraRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceEntityをRaceRecordに変換する
        const raceRecordList: JraRaceRecord[] = request.raceEntityList.map(
            (raceEntity) => raceEntity.toRecord(),
        );

        // idが重複しているデータは上書きをし、新規のデータは追加する
        raceRecordList.forEach((raceRecord) => {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchRaceRecordList.findIndex(
                (record) => record.id === raceRecord.id,
            );
            if (index !== -1) {
                existFetchRaceRecordList[index] = raceRecord;
            } else {
                existFetchRaceRecordList.push(raceRecord);
            }
        });

        // 日付の最新順にソート
        existFetchRaceRecordList.sort(
            (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
        );

        // 月毎に分けられたplaceをS3にアップロードする
        await this.s3Gateway.uploadDataToS3(
            existFetchRaceRecordList,
            this.fileName,
        );
        return new RegisterRaceListResponse(200);
    }
}
