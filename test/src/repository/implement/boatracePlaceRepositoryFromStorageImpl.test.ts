import 'reflect-metadata';

import { parse } from 'date-fns';
import { format } from 'date-fns';
import { container } from 'tsyringe';

import { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { BoatracePlaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/boatracePlaceRepositoryFromStorageImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { mockS3GatewayForBoatracePlace } from '../../mock/gateway/s3GatewayMock';

describe('BoatracePlaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<BoatracePlaceRecord>>;
    let repository: BoatracePlaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3GatewayForBoatracePlace();

        // DIコンテナにモックを登録
        container.registerInstance('BoatracePlaceStorageGateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(BoatracePlaceRepositoryFromStorageImpl);
    });

    describe('fetchPlaceList', () => {
        test('正しい競馬場データを取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(
                async (filename: string) => {
                    // filenameから日付を取得 16時からの競馬場にしたい
                    const date = parse(
                        filename.slice(0, 6),
                        'yyyyMM',
                        new Date(),
                    );
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
                        '平和島',
                        'SG',
                        `boatrace${format(date, 'yyyyMM')}`,
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
            const placeDataList: BoatracePlaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        () =>
                            new BoatracePlaceEntity(
                                null,
                                new BoatracePlaceData(date, '平和島', 'SG'),
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterPlaceListRequest<BoatracePlaceEntity>(
                placeDataList,
            );
            // テスト実行
            await repository.registerPlaceList(request);

            // uploadDataToS3が12回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(12);
        });
    });
});
