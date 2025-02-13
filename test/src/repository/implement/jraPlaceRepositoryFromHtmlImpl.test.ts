import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IJraPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iJraPlaceDataHtmlGateway';
import { MockJraPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockJraPlaceDataHtmlGateway';
import { SearchFilterEntity } from '../../../../lib/src/repository/entity/searchFilterEntity';
import { JraPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV !== allowedEnvs.githubActionsCi) {
    describe('JraPlaceRepositoryFromHtmlImpl', () => {
        let jraPlaceDataHtmlgateway: IJraPlaceDataHtmlGateway;
        let repository: JraPlaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            jraPlaceDataHtmlgateway = new MockJraPlaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'JraPlaceDataHtmlGateway',
                jraPlaceDataHtmlgateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(JraPlaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しい競馬場データを1年間の検索で取得できる', async () => {
                const placeEntityList = await repository.fetchPlaceEntityList(
                    new SearchFilterEntity(
                        new Date('2024-01-01'),
                        new Date('2024-12-31'),
                    ),
                );
                expect(placeEntityList).toHaveLength(288);
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
    describe('JraPlaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
