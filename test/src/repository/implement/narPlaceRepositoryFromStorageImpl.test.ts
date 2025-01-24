import 'reflect-metadata';

import * as fs from 'fs';
import * as path from 'path';
import { container } from 'tsyringe';

import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { NarPlaceRecord } from '../../../../lib/src/gateway/record/narPlaceRecord';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarPlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/narPlaceRepositoryFromStorageImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3GatewayForNarPlace } from '../../mock/gateway/s3GatewayMock';

describe('NarPlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<NarPlaceRecord>>;
    let repository: NarPlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForNarPlace();

        // DIコンテナにモックを登録
        container.registerInstance('NarPlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(NarPlaceRepositoryFromStorageImpl);
    });

    describe('fetchPlaceList', () => {
        test('正しい競馬場データを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/nar/placeList.csv',
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
            const request = new RegisterPlaceListRequest<NarPlaceEntity>(
                placeEntityList,
            );
            // テスト実行
            await repository.registerPlaceEntityList(request);

            // uploadDataToS3が12回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間の競馬場データを登録する
    const placeEntityList: NarPlaceEntity[] = Array.from(
        { length: 366 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from(
                { length: 12 },
                () =>
                    new NarPlaceEntity(
                        null,
                        NarPlaceData.create(date, '大井'),
                        getJSTDate(new Date()),
                    ),
            );
        },
    ).flat();
});
