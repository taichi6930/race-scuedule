import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IAutoracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iAutoracePlaceDataHtmlGateway';
import { MockAutoracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockAutoracePlaceDataHtmlGateway';
import { AutoracePlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/autoracePlaceRepositoryFromHtmlImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV !== allowedEnvs.githubActionsCi) {
    describe('AutoracePlaceRepositoryFromHtmlImpl', () => {
        let autoracePlaceDataHtmlgateway: IAutoracePlaceDataHtmlGateway;
        let repository: AutoracePlaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            autoracePlaceDataHtmlgateway =
                new MockAutoracePlaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'AutoracePlaceDataHtmlGateway',
                autoracePlaceDataHtmlgateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(AutoracePlaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しいオートレース場データを取得できる', async () => {
                const placeEntityList = await repository.fetchPlaceEntityList(
                    new FetchPlaceListRequest(
                        new Date('2024-11-01'),
                        new Date('2024-11-30'),
                    ),
                );
                expect(placeEntityList).toHaveLength(60);
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
    describe('AutoracePlaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
