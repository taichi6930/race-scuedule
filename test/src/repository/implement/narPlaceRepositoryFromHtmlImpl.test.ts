import 'reflect-metadata';

import { container } from 'tsyringe';

import type { INarPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iNarPlaceDataHtmlGateway';
import { MockNarPlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockNarPlaceDataHtmlGateway';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarPlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/narPlaceRepositoryFromHtmlImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../../../lib/src/repository/request/registerPlaceListRequest';
import { ENV } from '../../../../lib/src/utility/env';

if (ENV !== 'GITHUB_ACTIONS_CI') {
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
                const response = await repository.fetchPlaceList(
                    new FetchPlaceListRequest(
                        new Date('2024-10-01'),
                        new Date('2024-10-31'),
                    ),
                );
                expect(response.placeDataList).toHaveLength(115);
            });
        });

        describe('registerPlaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterPlaceListRequest<NarPlaceEntity>(
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
    describe('NarPlaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
