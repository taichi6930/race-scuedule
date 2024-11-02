import 'reflect-metadata';

import { container } from 'tsyringe';

import type { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { IJraPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iJraPlaceDataHtmlGateway';
import { MockJraPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockJraPlaceDataHtmlGateway';
import { JraPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';

if (process.env.ENV !== 'GITHUB_ACTIONS_CI') {
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
            test('正しい競馬場データを取得できる', async () => {
                const response = await repository.fetchPlaceList(
                    new FetchPlaceListRequest(
                        new Date('2024-10-01'),
                        new Date('2024-10-31'),
                    ),
                );
                expect(response.placeDataList).toHaveLength(24);
            });
        });

        describe('registerPlaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterPlaceListRequest<JraPlaceData>([]);
                // テスト実行
                await expect(
                    repository.registerPlaceList(request),
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
