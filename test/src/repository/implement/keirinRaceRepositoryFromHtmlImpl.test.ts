import 'reflect-metadata';

import { container } from 'tsyringe';

import { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { IKeirinRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iKeirinRaceDataHtmlGateway';
import { MockKeirinRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockKeirinRaceDataHtmlGateway';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import { KeirinRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/keirinRaceRepositoryFromHtmlImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { ENV } from '../../../../lib/src/utility/env';

if (ENV !== 'GITHUB_ACTIONS_CI') {
    describe('KeirinRaceRepositoryFromHtmlImpl', () => {
        let keirinRaceDataHtmlGateway: IKeirinRaceDataHtmlGateway;
        let repository: KeirinRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            keirinRaceDataHtmlGateway = new MockKeirinRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'KeirinRaceDataHtmlGateway',
                keirinRaceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(KeirinRaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しい競馬場データを取得できる', async () => {
                const response = await repository.fetchRaceList(
                    new FetchRaceListRequest<KeirinPlaceEntity>(
                        new Date('2024-10-20'),
                        new Date('2024-10-20'),
                        [
                            new KeirinPlaceEntity(
                                null,
                                new KeirinPlaceData(
                                    new Date('2024-10-20'),
                                    '弥彦',
                                    'GⅠ',
                                ),
                            ),
                        ],
                    ),
                );
                expect(response.raceDataList).toHaveLength(12);
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterRaceListRequest<KeirinRaceEntity>(
                    [],
                );
                // テスト実行
                await expect(
                    repository.registerRaceList(request),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
} else {
    describe('KeirinRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
