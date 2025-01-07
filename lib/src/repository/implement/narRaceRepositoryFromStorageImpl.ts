import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { NarRaceRecord } from '../../gateway/record/narRaceRecord';
import {
    NarGradeType,
    NarRaceCourse,
    NarRaceCourseType,
} from '../../utility/data/nar';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

@injectable()
export class NarRaceRepositoryFromStorageImpl
    implements IRaceRepository<NarRaceEntity, NarPlaceEntity>
{
    private readonly fileName = 'raceList.csv';

    constructor(
        @inject('NarRaceS3Gateway')
        private s3Gateway: IS3Gateway<NarRaceRecord>,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<NarPlaceEntity>,
    ): Promise<FetchRaceListResponse<NarRaceEntity>> {
        // ファイル名リストから海外競馬場開催データを取得する
        const raceRecordList: NarRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceRecordをRaceEntityに変換
        const newRaceEntityList: NarRaceEntity[] = raceRecordList.map(
            (raceRecord) => raceRecord.toEntity(),
        );

        // フィルタリング処理（日付の範囲指定）
        const filteredRaceEntityList: NarRaceEntity[] =
            newRaceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= request.startDate &&
                    raceEntity.raceData.dateTime <= request.finishDate,
            );
        return new FetchRaceListResponse<NarRaceEntity>(filteredRaceEntityList);
    }

    /**
     * 新ファイルリストからレースデータを取得する
     */
    @Logger
    private async getRaceRecordListFromS3(): Promise<NarRaceRecord[]> {
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
            updateDate: headers.indexOf('updateDate'),
        };

        console.log('データ行を100件ずつ分割');

        // データ行を100件ずつ分割
        const chunkSize = 100;
        const chunks: string[][] = [];
        for (let i = 1; i < lines.length; i += chunkSize) {
            chunks.push(lines.slice(i, i + chunkSize));
        }

        // 並列で処理を実行
        const results = await Promise.all(
            chunks.map((chunk) =>
                chunk
                    .map((line: string) => {
                        const columns = line.replace('\r', '').split(',');

                        // 必要なフィールドが存在しない場合はundefinedを返す
                        if (
                            !columns[indices.name] ||
                            isNaN(parseInt(columns[indices.number]))
                        ) {
                            return undefined;
                        }

                        const updateDate = columns[indices.updateDate]
                            ? new Date(columns[indices.updateDate])
                            : getJSTDate(new Date());

                        return new NarRaceRecord(
                            columns[indices.id],
                            columns[indices.name],
                            new Date(columns[indices.dateTime]),
                            columns[indices.location] as NarRaceCourse,
                            columns[indices.surfaceType] as NarRaceCourseType,
                            parseInt(columns[indices.distance]),
                            columns[indices.grade] as NarGradeType,
                            parseInt(columns[indices.number]),
                            updateDate,
                        );
                    })
                    .filter(
                        (raceData): raceData is NarRaceRecord =>
                            raceData !== undefined,
                    ),
            ),
        );

        console.log('結果を1つにまとめ、重複を排除');

        // 結果を1つにまとめ、重複を排除
        const mergedResults = results.flat();
        return mergedResults;
    }

    /**
     * レースデータを登録する
     * @param request
     */
    @Logger
    async registerRaceEntityList(
        request: RegisterRaceListRequest<NarRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        // 既に登録されているデータを取得する
        const existFetchRaceRecordList: NarRaceRecord[] =
            await this.getRaceRecordListFromS3();

        // RaceEntityをRaceRecordに変換する
        const raceRecordList: NarRaceRecord[] = request.raceEntityList.map(
            (raceEntity) => raceEntity.toRecord(),
        );

        // idをキーとしたMapを作成し、既存データを上書きまたは追加する
        const raceRecordMap = new Map<string, NarRaceRecord>(
            existFetchRaceRecordList.map((record) => [record.id, record]),
        );

        raceRecordList.forEach((raceRecord) => {
            raceRecordMap.set(raceRecord.id, raceRecord);
        });

        // Mapからリストに変換し、日付の最新順にソート
        const updatedRaceRecordList = Array.from(raceRecordMap.values()).sort(
            (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
        );

        // 月毎に分けられたplaceをS3にアップロードする
        await this.s3Gateway.uploadDataToS3(
            updatedRaceRecordList,
            this.fileName,
        );
        return new RegisterRaceListResponse(200);
    }
}
