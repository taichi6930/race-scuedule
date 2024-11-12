import 'reflect-metadata';

import { format, parse } from 'date-fns';
import { container } from 'tsyringe';

import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import { AutoraceRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/autoraceRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { AUTORACE_PLACE_CODE } from '../../../../lib/src/utility/data/autorace';
import { mockS3Gateway } from '../../mock/gateway/s3GatewayMock';

describe('AutoraceRaceRepositoryFromStorageImpl', () => {
    let s3Gateway: jest.Mocked<IS3Gateway<AutoraceRaceEntity>>;
    let repository: AutoraceRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        s3Gateway = mockS3Gateway<AutoraceRaceEntity>();

        // DIコンテナにモックを登録
        container.registerInstance('AutoraceRaceS3Gateway', s3Gateway);

        // テスト対象のリポジトリを生成
        repository = container.resolve(AutoraceRaceRepositoryFromStorageImpl);
    });

    describe('fetchRaceList', () => {
        test('正しいレースデータを取得できる', async () => {
            // モックの戻り値を設定
            s3Gateway.fetchDataFromS3.mockImplementation(
                async (filename: string) => {
                    // filenameから日付を取得 16時からのレースにしたい
                    const date = parse(
                        filename.slice(0, 8),
                        'yyyyMMdd',
                        new Date(),
                    );
                    date.setHours(16);
                    const csvHeaderDataText: string = [
                        'name',
                        'stage',
                        'dateTime',
                        'location',
                        'grade',
                        'number',
                        'id',
                    ].join(',');
                    const csvDataText: string = [
                        `raceName${filename.slice(0, 8)}`,
                        `優勝戦`,
                        date.toISOString(),
                        '飯塚',
                        'SG',
                        '1',
                        `autorace${format(date, 'yyyyMMdd')}${AUTORACE_PLACE_CODE['平塚']}01`,
                    ].join(',');
                    const csvDataRameNameUndefinedText: string = [
                        undefined,
                        `優勝戦`,
                        date.toISOString(),
                        '飯塚',
                        'SG',
                        '1',
                        `autorace${format(date, 'yyyyMMdd')}${AUTORACE_PLACE_CODE['平塚']}01`,
                    ].join(',');
                    const csvDataNumUndefinedText: string = [
                        `raceName${filename.slice(0, 8)}`,
                        `優勝戦`,
                        date.toISOString(),
                        '飯塚',
                        'SG',
                        undefined,
                        `autorace${format(date, 'yyyyMMdd')}${AUTORACE_PLACE_CODE['平塚']}01`,
                    ].join(',');
                    const csvDatajoinText: string = [
                        csvHeaderDataText,
                        csvDataText,
                        csvDataRameNameUndefinedText,
                        csvDataNumUndefinedText,
                    ].join('\n');
                    return Promise.resolve(csvDatajoinText);
                },
            );
            // リクエストの作成
            const request = new FetchRaceListRequest<AutoracePlaceEntity>(
                new Date('2024-01-01'),
                new Date('2024-02-01'),
            );
            // テスト実行
            const response = await repository.fetchRaceList(request);

            // レスポンスの検証
            expect(response.raceDataList).toHaveLength(32);
        });
    });

    describe('registerRaceList', () => {
        test('正しいレースデータを登録できる', async () => {
            // 1年間のレースデータを登録する
            const raceDataList: AutoraceRaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        (__, j) =>
                            new AutoraceRaceEntity(
                                null,
                                `raceName${format(date, 'yyyyMMdd')}`,
                                `優勝戦`,
                                date,
                                '飯塚',
                                'SG',
                                j + 1,
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterRaceListRequest<AutoraceRaceEntity>(
                raceDataList,
            );
            // テスト実行
            await repository.registerRaceList(request);

            // uploadDataToS3が366回呼ばれることを検証
            expect(s3Gateway.uploadDataToS3).toHaveBeenCalledTimes(366);
        });
    });
});
