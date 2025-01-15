import 'reflect-metadata';

import { parse } from 'date-fns';
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
            s3Gateway.fetchDataFromS3.mockImplementation(async () => {
                // filenameから日付を取得 16時からの競馬場にしたい
                const date = parse('2024', 'yyyy', new Date());
                date.setHours(16);
                console.log(date);

                // CSVのヘッダーを定義
                const csvHeaderDataText = [
                    'id',
                    'dateTime',
                    'location',
                    'heldTimes',
                    'heldDayTimes',
                    'updateDate',
                ].join(',');
                const csvDataText: string = [
                    `jra2024010105`,
                    date.toISOString(),
                    '東京',
                    '1',
                    '1',
                    getJSTDate(new Date()).toISOString(),
                ].join(',');
                const csvDataIdUndefinedText: string = [
                    `jra20240101undefined`,
                    date.toISOString(),
                    '東京',
                    '1',
                    '1',
                    undefined,
                ].join(',');
                // ヘッダーとデータ行を結合して完全なCSVデータを生成
                const csvDatajoinText: string = [
                    csvHeaderDataText,
                    csvDataText,
                    csvDataIdUndefinedText,
                ].join('\n');
                return Promise.resolve(csvDatajoinText);
            });
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
});
