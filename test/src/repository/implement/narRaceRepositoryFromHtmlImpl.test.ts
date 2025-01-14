import 'reflect-metadata';

import { container } from 'tsyringe';

import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { INarRaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iNarRaceDataHtmlGateway';
import { MockNarRaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockNarRaceDataHtmlGateway';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import { NarRaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/narRaceRepositoryFromHtmlImpl';
import { FetchRaceListRequest } from '../../../../lib/src/repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../../../lib/src/repository/request/registerRaceListRequest';
import { getJSTDate } from '../../../../lib/src/utility/date';
import { ENV } from '../../../../lib/src/utility/env';

if (ENV !== 'GITHUB_ACTIONS_CI') {
    describe('NarRaceRepositoryFromHtmlImpl', () => {
        let narRaceDataHtmlGateway: INarRaceDataHtmlGateway;
        let repository: NarRaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            narRaceDataHtmlGateway = new MockNarRaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'NarRaceDataHtmlGateway',
                narRaceDataHtmlGateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(NarRaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しい競馬場データを取得できる', async () => {
                const response = await repository.fetchRaceEntityList(
                    new FetchRaceListRequest<NarPlaceEntity>(
                        new Date('2024-10-02'),
                        new Date('2024-10-02'),
                        [
                            new NarPlaceEntity(
                                null,
                                NarPlaceData.create(
                                    new Date('2024-10-02'),
                                    '大井',
                                ),
                                getJSTDate(new Date()),
                            ),
                        ],
                    ),
                );
                expect(response.raceEntityList).toHaveLength(12);
            });
        });

        describe('registerRaceList', () => {
            test('htmlなので登録できない', async () => {
                // リクエストの作成
                const request = new RegisterRaceListRequest<NarRaceEntity>([]);
                // テスト実行
                await expect(
                    repository.registerRaceEntityList(request),
                ).rejects.toThrow('HTMLにはデータを登録出来ません');
            });
        });
    });
} else {
    describe('NarRaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
