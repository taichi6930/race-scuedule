import 'reflect-metadata';

import * as fs from 'fs';
import * as path from 'path';
import { container } from 'tsyringe';

import { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { JraPlaceRecord } from '../../../../lib/src/gateway/record/jraPlaceRecord';
import { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import { JraPlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/jraPlaceRepositoryFromStorageImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3GatewayForJraPlace } from '../../mock/gateway/s3GatewayMock';

describe('JraPlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<JraPlaceRecord>>;
    let repository: JraPlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForJraPlace();

        // DIコンテナにモックを登録
        container.registerInstance('JraPlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(JraPlaceRepositoryFromStorageImpl);
    });

    describe('fetchPlaceList', () => {
        test('正しい競馬場データを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/jra/placeList.csv',
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
        test('正しい競馬場データを登録できる', async () => {
            // リクエストの作成
            const request = new RegisterPlaceListRequest<JraPlaceEntity>(
                placeEntityList,
            );
            // テスト実行
            await repository.registerPlaceEntityList(request);

            // uploadDataToS3が12回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間の競馬場データを登録する
    const placeEntityList: JraPlaceEntity[] = Array.from(
        { length: 366 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from(
                { length: 12 },
                () =>
                    new JraPlaceEntity(
                        null,
                        JraPlaceData.create(date, '東京', 1, 1),
                        getJSTDate(new Date()),
                    ),
            );
        },
    ).flat();
});
