import 'reflect-metadata';

import { container } from 'tsyringe';

import type { INarPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iNarPlaceDataHtmlGateway';
import { MockNarPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockNarPlaceDataHtmlGateway';
import { SearchFilterEntity } from '../../../../lib/src/repository/entity/searchFilterEntity';
import { NarPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/narPlaceRepositoryFromHtmlImpl';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV !== allowedEnvs.githubActionsCi) {
    describe('NarPlaceRepositoryFromHtmlImpl', () => {
        let narPlaceDataHtmlgateway: INarPlaceDataHtmlGateway;
        let repository: NarPlaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            narPlaceDataHtmlgateway = new MockNarPlaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'NarPlaceDataHtmlGateway',
                narPlaceDataHtmlgateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(NarPlaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しい競馬場データを取得できる', async () => {
                const placeEntityList = await repository.fetchPlaceEntityList(
                    new SearchFilterEntity(
                        new Date('2024-10-01'),
                        new Date('2024-10-31'),
                    ),
                );
                expect(placeEntityList).toHaveLength(120);
            });
        });

        describe('registerPlaceList', () => {
            test('htmlなので登録できない', async () => {
                // テスト実行
                await expect(
                    repository.registerPlaceEntityList([]),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
} else {
    describe('NarPlaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
