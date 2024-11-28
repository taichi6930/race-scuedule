import 'reflect-metadata';

import { format, parse } from 'date-fns';
import { container } from 'tsyringe';

import { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { JraPlaceRecord } from '../../../../lib/src/gateway/record/jraPlaceRecord';
import { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import { JraPlaceRepositoryFromS3Impl } from '../../../../lib/src/repository/implement/jraPlaceRepositoryFromS3Impl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { mockS3GatewayForJraPlace } from '../../mock/gateway/s3GatewayMock';

describe('JraPlaceRepositoryFromS3Impl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<JraPlaceRecord>>;
    let repository: JraPlaceRepositoryFromS3Impl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForJraPlace();

        // DIコンテナにモックを登録
        container.registerInstance('JraPlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(JraPlaceRepositoryFromS3Impl);
    });

    describe('fetchPlaceList', () => {
        test('正しい競馬場データを取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(
                async (filename: string) => {
                    // filenameから日付を取得 16時からの競馬場にしたい
                    const date = parse(
                        filename.slice(0, 4),
                        'yyyy',
                        new Date(),
                    );
                    date.setHours(16);
                    console.log(date);

                    // CSVのヘッダーを定義
                    const csvHeaderDataText = [
                        'id',
                        'dateTime',
                        'location',
                        'heldTimes',
                        'heldDayTimes',
                    ].join(',');

                    const csvDataText: string = [
                        `jra${format(date, 'yyyyMMdd')}05`,
                        date.toISOString(),
                        '東京',
                        '1',
                        '1',
                    ].join(',');
                    // ヘッダーとデータ行を結合して完全なCSVデータを生成
                    const csvDatajoinText: string = [
                        csvHeaderDataText,
                        csvDataText,
                    ].join('\n');
                    return Promise.resolve(csvDatajoinText);
                },
            );
            // リクエストの作成
            const request = new FetchPlaceListRequest(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
            );
            // テスト実行
            const response = await repository.fetchPlaceList(request);

            // レスポンスの検証
            expect(response.placeDataList).toHaveLength(1);
        });
    });

    describe('registerPlaceList', () => {
        test('正しい競馬場データを登録できる', async () => {
            // 1年間の競馬場データを登録する
            const placeDataList: JraPlaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        () =>
                            new JraPlaceEntity(
                                null,
                                new JraPlaceData(date, '東京', 1, 1),
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterPlaceListRequest<JraPlaceEntity>(
                placeDataList,
            );
            // テスト実行
            await repository.registerPlaceList(request);

            // uploadDataToS3が12回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });
});
