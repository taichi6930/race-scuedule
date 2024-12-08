import 'reflect-metadata';

import { parse } from 'date-fns';
import { format } from 'date-fns';
import { container } from 'tsyringe';

import { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { KeirinPlaceRecord } from '../../../../lib/src/gateway/record/keirinPlaceRecord';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinPlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/keirinPlaceRepositoryFromStorageImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { mockS3GatewayForKeirinPlace } from '../../mock/gateway/s3GatewayMock';

describe('KeirinPlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<KeirinPlaceRecord>>;
    let repository: KeirinPlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForKeirinPlace();

        // DIコンテナにモックを登録
        container.registerInstance('KeirinPlaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(KeirinPlaceRepositoryFromStorageImpl);
    });

    describe('fetchPlaceList', () => {
        test('正しい競輪場データを取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(async () => {
                // filenameから日付を取得 16時からの競輪場にしたい
                const date = parse('202401', 'yyyyMM', new Date());
                date.setHours(16);
                console.log(date);

                // CSVのヘッダーを定義
                const csvHeaderDataText = [
                    'dateTime',
                    'location',
                    'grade',
                    'id',
                ].join(',');

                // データ行を生成
                const csvDataText: string = [
                    format(date, 'yyyy-MM-dd HH:mm:ss'),
                    '平塚',
                    'GP',
                    `keirin${format(date, 'yyyyMM')}`,
                ].join(',');
                // データ行を生成
                const csvUndefinedDataText: string = [
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ].join(',');

                // ヘッダーとデータ行を結合して完全なCSVデータを生成
                const csvDatajoinText: string = [
                    csvHeaderDataText,
                    csvDataText,
                    csvUndefinedDataText,
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
        test('正しい競輪場データを登録できる', async () => {
            // 1年間の競輪場データを登録する
            const placeEntityList: KeirinPlaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        () =>
                            new KeirinPlaceEntity(
                                null,
                                new KeirinPlaceData(date, '平塚', 'GP'),
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterPlaceListRequest<KeirinPlaceEntity>(
                placeEntityList,
            );
            // テスト実行
            await repository.registerPlaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });
});
