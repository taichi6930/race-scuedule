import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IAutoracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iAutoracePlaceDataHtmlGateway';
import { MockAutoracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockAutoracePlaceDataHtmlGateway';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoracePlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/autoracePlaceRepositoryFromHtmlImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { ENV } from '../../../../lib/src/utility/env';

if (ENV !== 'GITHUB_ACTIONS_CI') {
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
            test('正しい競馬場データを取得できる', async () => {
                const response = await repository.fetchPlaceList(
                    new FetchPlaceListRequest(
                        new Date('2024-11-01'),
                        new Date('2024-11-30'),
                    ),
                );
                expect(response.placeDataList).toHaveLength(58);
            });
        });

        describe('registerPlaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request =
                    new RegisterPlaceListRequest<AutoracePlaceEntity>([]);
                // テスト実行
                await expect(
                    repository.registerPlaceList(request),
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
