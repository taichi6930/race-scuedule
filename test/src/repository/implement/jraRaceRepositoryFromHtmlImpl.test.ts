import 'reflect-metadata';

import { container } from 'tsyringe';

import { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { IJraRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iJraRaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockJraRaceDataHtmlGateway';
import { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import { JraRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/jraRaceRepositoryFromHtmlImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { ENV } from '../../../../lib/src/utility/env';

if (ENV !== 'GITHUB_ACTIONS_CI') {
    describe('JraRaceRepositoryFromHtmlImpl', () => {
        let jraRaceDataHtmlGateway: IJraRaceDataHtmlGateway;
        let repository: JraRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            jraRaceDataHtmlGateway = new MockJraRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'JraRaceDataHtmlGateway',
                jraRaceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(JraRaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しい競馬場データを取得できる', async () => {
                const response = await repository.fetchRaceList(
                    new FetchRaceListRequest<JraPlaceEntity>(
                        new Date('2024-05-26'),
                        new Date('2024-05-26'),
                        [
                            new JraPlaceEntity(
                                null,
                                new JraPlaceData(
                                    new Date('2024-05-26'),
                                    '東京',
                                    1,
                                    1,
                                ),
                            ),
                        ],
                    ),
                );
                expect(response.raceEntityList).toHaveLength(24);
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterRaceListRequest<JraRaceEntity>([]);
                // テスト実行
                await expect(
                    repository.registerRaceList(request),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
} else {
    describe('JraRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
