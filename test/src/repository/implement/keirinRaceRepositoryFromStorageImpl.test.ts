import 'reflect-metadata';

import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { container } from 'tsyringe';

import { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { KeirinRacePlayerRecord } from '../../../../lib/src/gateway/record/keirinRacePlayerRecord';
import type { KeirinRaceRecord } from '../../../../lib/src/gateway/record/keirinRaceRecord';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import { KeirinRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/keirinRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { baseKeirinRacePlayerDataList } from '../../mock/common/baseKeirinData';
import { mockS3Gateway } from '../../mock/gateway/mockS3Gateway';

describe('KeirinRaceRepositoryFromStorageImpl', () => {
    let raceS3Gateway: jest.Mocked<IS3Gateway<KeirinRaceRecord>>;
    let racePlayerS3Gateway: jest.Mocked<IS3Gateway<KeirinRacePlayerRecord>>;
    let repository: KeirinRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        raceS3Gateway = mockS3Gateway<KeirinRaceRecord>();
        racePlayerS3Gateway = mockS3Gateway<KeirinRacePlayerRecord>();

        // DIコンテナにモックを登録
        container.registerInstance('KeirinRaceS3Gateway', raceS3Gateway);
        container.registerInstance(
            'KeirinRacePlayerS3Gateway',
            racePlayerS3Gateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(KeirinRaceRepositoryFromStorageImpl);
    });

    describe('fetchRaceList', () => {
        test('正しいレースデータを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/keirin/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            raceS3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // モックの戻り値を設定
            racePlayerS3Gateway.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/keirin/racePlayerList.csv',
                    ),
                    'utf-8',
                ),
            );

            // リクエストの作成
            const request = new FetchRaceListRequest<KeirinPlaceEntity>(
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
            // 1年間のレースデータを登録する
            const raceEntityList: KeirinRaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        (__, j) =>
                            new KeirinRaceEntity(
                                null,
                                KeirinRaceData.create(
                                    `raceName${format(date, 'yyyyMMdd')}`,
                                    `S級決勝`,
                                    date,
                                    '平塚',
                                    'GⅠ',
                                    j + 1,
                                ),
                                baseKeirinRacePlayerDataList,
                                getJSTDate(new Date()),
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterRaceListRequest<KeirinRaceEntity>(
                raceEntityList,
            );
            // テスト実行
            await repository.registerRaceEntityList(request);

            // uploadDataToS3が1回呼ばれることを検証
            expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
        });
    });

    test('DBにデータの存在するところに、正しいレースデータを登録できる', async () => {
        // 1年間のレースデータを登録する
        const raceEntityList: KeirinRaceEntity[] = Array.from(
            { length: 366 },
            (_, day) => {
                const date = new Date('2024-01-01');
                date.setDate(date.getDate() + day);
                return Array.from(
                    { length: 12 },
                    (__, j) =>
                        new KeirinRaceEntity(
                            null,
                            KeirinRaceData.create(
                                `raceName${format(date, 'yyyyMMdd')}`,
                                `S級決勝`,
                                date,
                                '平塚',
                                'GⅠ',
                                j + 1,
                            ),
                            baseKeirinRacePlayerDataList,
                            getJSTDate(new Date()),
                        ),
                );
            },
        ).flat();

        // モックの戻り値を設定
        const csvFilePath = path.resolve(
            __dirname,
            '../../mock/repository/csv/keirin/raceList.csv',
        );
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');

        raceS3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

        // モックの戻り値を設定
        racePlayerS3Gateway.fetchDataFromS3.mockResolvedValue(
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    '../../mock/repository/csv/keirin/racePlayerList.csv',
                ),
                'utf-8',
            ),
        );

        // リクエストの作成
        const request = new RegisterRaceListRequest<KeirinRaceEntity>(
            raceEntityList,
        );
        // テスト実行
        await repository.registerRaceEntityList(request);

        // uploadDataToS3が1回呼ばれることを検証
        expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
    });
});
