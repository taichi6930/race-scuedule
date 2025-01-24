import 'reflect-metadata';

import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { container } from 'tsyringe';

import { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { JraRaceRecord } from '../../../../lib/src/gateway/record/jraRaceRecord';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import { JraRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/jraRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { mockS3GatewayForJraRace } from '../../mock/gateway/s3GatewayMock';

describe('JraRaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<JraRaceRecord>>;
    let repository: JraRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForJraRace();

        // DIコンテナにモックを登録
        container.registerInstance('JraRaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(JraRaceRepositoryFromStorageImpl);
    });

    describe('fetchRaceList', () => {
        test('正しいレースデータを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/jra/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // リクエストの作成
            const request = new FetchRaceListRequest<JraPlaceEntity>(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
            );
            // テスト実行
            const response = await repository.fetchRaceEntityList(request);

            // レスポンスの検証
            expect(response.raceEntityList).toHaveLength(1);
        });
    });

    describe('registerRaceList', () => {
        test('DBが空データのところに、正しいレースデータを登録できる', async () => {
            // リクエストの作成
            const request = new RegisterRaceListRequest<JraRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が366回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });

        test('DBにデータの存在するところに、正しいレースデータを登録できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/jra/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            s3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // リクエストの作成
            const request = new RegisterRaceListRequest<JraRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が366回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    // 1年間のレースデータを登録する
    const raceEntityList: JraRaceEntity[] = Array.from(
        { length: 366 },
        (_, day) => {
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day);
            return Array.from(
                { length: 12 },
                (__, j) =>
                    new JraRaceEntity(
                        null,
                        JraRaceData.create(
                            `raceName${format(date, 'yyyyMMdd')}`,
                            date,
                            '東京',
                            'ダート',
                            1200,
                            'GⅠ',
                            j + 1,
                            1,
                            1,
                        ),
                        getJSTDate(new Date()),
                    ),
            );
        },
    ).flat();
});
