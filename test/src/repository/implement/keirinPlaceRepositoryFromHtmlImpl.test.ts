import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IKeirinPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iKeirinPlaceDataHtmlGateway';
import { MockKeirinPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockKeirinPlaceDataHtmlGateway';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';

if (process.env.ENV !== 'GITHUB_ACTIONS_CI') {
    describe('KeirinPlaceRepositoryFromHtmlImpl', () => {
        let keirinPlaceDataHtmlgateway: IKeirinPlaceDataHtmlGateway;
        let repository: KeirinPlaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            keirinPlaceDataHtmlgateway = new MockKeirinPlaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'KeirinPlaceDataHtmlGateway',
                keirinPlaceDataHtmlgateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(KeirinPlaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しい競馬場データを取得できる', async () => {
                const response = await repository.fetchPlaceList(
                    new FetchPlaceListRequest(
                        new Date('2024-10-01'),
                        new Date('2024-10-31'),
                    ),
                );
                expect(response.placeDataList).toHaveLength(221);
            });
        });

        describe('registerPlaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterPlaceListRequest<KeirinPlaceEntity>(
                    [],
                );
                // テスト実行
                await expect(
                    repository.registerPlaceList(request),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
} else {
    describe('KeirinPlaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
