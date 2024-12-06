import 'reflect-metadata';

import { format, parse } from 'date-fns';
import { container } from 'tsyringe';

import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { NarPlaceRecord } from '../../../../lib/src/gateway/record/narPlaceRecord';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarPlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/narPlaceRepositoryFromStorageImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
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
                    ].join(',');

                    const csvDataText: string = [
                        `nar${format(date, 'yyyyMMdd')}05`,
                        date.toISOString(),
                        '大井',
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
            const response = await repository.fetchPlaceEntityList(request);

            // レスポンスの検証
            expect(response.placeEntityList).toHaveLength(1);
        });
    });

    describe('registerPlaceList', () => {
        test('正しい競馬場データを登録できる', async () => {
            // 1年間の競馬場データを登録する
            const placeDataList: NarPlaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        () =>
                            new NarPlaceEntity(
                                null,
                                new NarPlaceData(date, '大井'),
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterPlaceListRequest<NarPlaceEntity>(
                placeDataList,
            );
            // テスト実行
            await repository.registerPlaceEntityList(request);

            // uploadDataToS3が12回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });
});
