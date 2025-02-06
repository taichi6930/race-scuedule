import 'reflect-metadata';

import * as fs from 'fs';
import * as path from 'path';
import { container } from 'tsyringe';

import { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { BoatracePlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/boatracePlaceRepositoryFromStorageImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('BoatracePlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<BoatracePlaceRecord>>;
    let repository: BoatracePlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3Gateway<BoatracePlaceRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('BoatracePlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(BoatracePlaceRepositoryFromStorageImpl);
    });

    describe('fetchPlaceList', () => {
        test('正しいボートレース場データを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/boatrace/placeList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // リクエストの作成
            const request = new FetchPlaceListRequest(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
            );
            // テスト実行
            const response = await repository.fetchPlaceEntityList(request);

            // レスポンスの検証
            expect(response.placeEntityList).toHaveLength(1);
        });
    });

    describe('registerPlaceList', () => {
        test('正しいボートレース場データを登録できる', async () => {
            // リクエストの作成
            const request = new RegisterPlaceListRequest<BoatracePlaceEntity>(
                placeEntityList,
            );
            // テスト実行
            await repository.registerPlaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間のボートレース場データを登録する
    const placeEntityList: BoatracePlaceEntity[] = Array.from(
        { length: 366 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from({ length: 12 }, () =>
                BoatracePlaceEntity.createWithoutId(
                    BoatracePlaceData.create(date, '平和島', 'SG'),
                    getJSTDate(new Date()),
                ),
            );
        },
    ).flat();
});
