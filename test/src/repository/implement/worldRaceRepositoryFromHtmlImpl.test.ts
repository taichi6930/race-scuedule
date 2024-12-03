import 'reflect-metadata';

import { container } from 'tsyringe';

import { WorldPlaceData } from '../../../../lib/src/domain/worldPlaceData';
import type { IWorldRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iWorldRaceDataHtmlGateway';
import { MockWorldRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockWorldRaceDataHtmlGateway';
import { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import { WorldRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/worldRaceRepositoryFromHtmlImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { ENV } from '../../../../lib/src/utility/env';

if (ENV !== 'GITHUB_ACTIONS_CI') {
    describe('WorldRaceRepositoryFromHtmlImpl', () => {
        let worldRaceDataHtmlGateway: IWorldRaceDataHtmlGateway;
        let repository: WorldRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            worldRaceDataHtmlGateway = new MockWorldRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'WorldRaceDataHtmlGateway',
                worldRaceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(WorldRaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しい競馬場データを取得できる', async () => {
                const response = await repository.fetchRaceList(
                    new FetchRaceListRequest<WorldPlaceEntity>(
                        new Date('2024-11-01'),
                        new Date('2024-11-30'),
                        [
                            new WorldPlaceEntity(
                                null,
                                new WorldPlaceData(
                                    new Date('2024-11-04'),
                                    'パリロンシャン',
                                ),
                            ),
                        ],
                    ),
                );
                expect(response.raceDataList).toHaveLength(16);
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterRaceListRequest<WorldRaceEntity>(
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
    describe('WorldRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
