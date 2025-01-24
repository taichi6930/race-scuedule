import 'reflect-metadata';

import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { container } from 'tsyringe';

import { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { BoatraceRacePlayerRecord } from '../../../../lib/src/gateway/record/boatraceRacePlayerRecord';
import type { BoatraceRaceRecord } from '../../../../lib/src/gateway/record/boatraceRaceRecord';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import { BoatraceRaceRepositoryFromStorageImpl } from '../../../../lib/src/repository/implement/boatraceRaceRepositoryFromStorageImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { baseBoatraceRacePlayerDataList } from '../../mock/common/baseBoatraceData';
import {
    mockS3GatewayForBoatraceRace,
    mockS3GatewayForBoatraceRacePlayer,
} from '../../mock/gateway/s3GatewayMock';

describe('BoatraceRaceRepositoryFromStorageImpl', () => {
    let raceS3Gateway: jest.Mocked<IS3Gateway<BoatraceRaceRecord>>;
    let racePlayerS3Gateway: jest.Mocked<IS3Gateway<BoatraceRacePlayerRecord>>;
    let repository: BoatraceRaceRepositoryFromStorageImpl;

    beforeEach(() => {
        // S3Gatewayのモックを作成
        raceS3Gateway = mockS3GatewayForBoatraceRace();
        racePlayerS3Gateway = mockS3GatewayForBoatraceRacePlayer();

        // DIコンテナにモックを登録
        container.registerInstance('BoatraceRaceS3Gateway', raceS3Gateway);
        container.registerInstance(
            'BoatraceRacePlayerS3Gateway',
            racePlayerS3Gateway,
        );

        // テスト対象のリポジトリを生成
        repository = container.resolve(BoatraceRaceRepositoryFromStorageImpl);
    });

    describe('fetchRaceList', () => {
        test('正しいレースデータを取得できる', async () => {
            // モックの戻り値を設定
            const csvFilePath = path.resolve(
                __dirname,
                '../../mock/repository/csv/boatrace/raceList.csv',
            );
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            raceS3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

            // モックの戻り値を設定
            racePlayerS3Gateway.fetchDataFromS3.mockResolvedValue(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../mock/repository/csv/boatrace/racePlayerList.csv',
                    ),
                    'utf-8',
                ),
            );

            // リクエストの作成
            const request = new FetchRaceListRequest<BoatracePlaceEntity>(
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
            const raceEntityList: BoatraceRaceEntity[] = Array.from(
                { length: 366 },
                (_, day) => {
                    const date = new Date('2024-01-01');
                    date.setDate(date.getDate() + day);
                    return Array.from(
                        { length: 12 },
                        (__, j) =>
                            new BoatraceRaceEntity(
                                null,
                                BoatraceRaceData.create(
                                    `raceName${format(date, 'yyyyMMdd')}`,
                                    `優勝戦`,
                                    date,
                                    '平和島',
                                    'GⅠ',
                                    j + 1,
                                ),
                                baseBoatraceRacePlayerDataList,
                                getJSTDate(new Date()),
                            ),
                    );
                },
            ).flat();

            // リクエストの作成
            const request = new RegisterRaceListRequest<BoatraceRaceEntity>(
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
        const raceEntityList: BoatraceRaceEntity[] = Array.from(
            { length: 366 },
            (_, day) => {
                const date = new Date('2024-01-01');
                date.setDate(date.getDate() + day);
                return Array.from(
                    { length: 12 },
                    (__, j) =>
                        new BoatraceRaceEntity(
                            null,
                            BoatraceRaceData.create(
                                `raceName${format(date, 'yyyyMMdd')}`,
                                `優勝戦`,
                                date,
                                '平和島',
                                'GⅠ',
                                j + 1,
                            ),
                            baseBoatraceRacePlayerDataList,
                            getJSTDate(new Date()),
                        ),
                );
            },
        ).flat();

        // モックの戻り値を設定
        const csvFilePath = path.resolve(
            __dirname,
            '../../mock/repository/csv/boatrace/raceList.csv',
        );
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');

        raceS3Gateway.fetchDataFromS3.mockResolvedValue(csvData);

        // モックの戻り値を設定
        racePlayerS3Gateway.fetchDataFromS3.mockResolvedValue(
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    '../../mock/repository/csv/boatrace/racePlayerList.csv',
                ),
                'utf-8',
            ),
        );

        // リクエストの作成
        const request = new RegisterRaceListRequest<BoatraceRaceEntity>(
            raceEntityList,
        );
        // テスト実行
        await repository.registerRaceEntityList(request);

        // uploadDataToS3が1回呼ばれることを検証
        expect(raceS3Gateway.uploadDataToS3).toHaveBeenCalledTimes(1);
    });
});
