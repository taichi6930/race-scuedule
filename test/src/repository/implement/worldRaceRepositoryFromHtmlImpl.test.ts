import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IWorldRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iWorldRaceDataHtmlGateway';
import { MockWorldRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockWorldRaceDataHtmlGateway';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/worldRaceRepositoryFromHtmlImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV === allowedEnvs.githubActionsCi) {
    describe('WorldRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
} else {
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
                const raceEntityList = await repository.fetchRaceEntityList(
                    new FetchRaceListRequest<WorldPlaceEntity>(
                        new Date('2024-10-01'),
                        new Date('2024-12-31'),
                        [],
                    ),
                );
                expect(raceEntityList).toHaveLength(43);
            });

            test('正しい競馬場データを取得できる（データが足りてないこともある）', async () => {
                const raceEntityList = await repository.fetchRaceEntityList(
                    new FetchRaceListRequest<WorldPlaceEntity>(
                        new Date('2025-01-01'),
                        new Date('2025-03-31'),
                        [],
                    ),
                );
                expect(raceEntityList).toHaveLength(1);
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // テスト実行
                await expect(
                    repository.registerRaceEntityList([]),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
}
