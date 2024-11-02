import 'reflect-metadata';

import { container } from 'tsyringe';

import { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { IJraRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iJraRaceDataHtmlGateway';
import { MockJraRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockJraRaceDataHtmlGateway';
import { JraRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/jraRaceRepositoryFromHtmlImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';

if (process.env.ENV !== 'GITHUB_ACTIONS_CI') {
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
                    new FetchRaceListRequest<JraPlaceData>(
                        new Date('2024-05-26'),
                        new Date('2024-05-26'),
                        [new JraPlaceData(new Date('2024-05-26'), '東京')],
                    ),
                );
                expect(response.raceDataList).toHaveLength(24);
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterRaceListRequest<JraRaceData>([]);
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
