import 'reflect-metadata';

import { container } from 'tsyringe';

import type { IBoatracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iBoatracePlaceDataHtmlGateway';
import { MockBoatracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/mock/mockBoatracePlaceDataHtmlGateway';
import { BoatracePlaceRepositoryFromHtmlImpl } from '../../../../lib/src/repository/implement/boatracePlaceRepositoryFromHtmlImpl';
import { FetchPlaceListRequest } from '../../../../lib/src/repository/request/fetchPlaceListRequest';
import { allowedEnvs, ENV } from '../../../../lib/src/utility/env';

if (ENV !== allowedEnvs.githubActionsCi) {
    describe('BoatracePlaceRepositoryFromHtmlImpl', () => {
        let boatracePlaceDataHtmlgateway: IBoatracePlaceDataHtmlGateway;
        let repository: BoatracePlaceRepositoryFromHtmlImpl;

        beforeEach(() => {
            // gatwayのモックを作成
            boatracePlaceDataHtmlgateway =
                new MockBoatracePlaceDataHtmlGateway();

            // DIコンテナにモックを登録
            container.registerInstance(
                'BoatracePlaceDataHtmlGateway',
                boatracePlaceDataHtmlgateway,
            );

            // テスト対象のリポジトリを生成
            repository = container.resolve(BoatracePlaceRepositoryFromHtmlImpl);
        });

        describe('fetchPlaceList', () => {
            test('正しいボートレース場データを取得できる', async () => {
                const placeEntityList = await repository.fetchPlaceEntityList(
                    new FetchPlaceListRequest(
                        new Date('2024-10-01'),
                        new Date('2024-12-31'),
                    ),
                );
                expect(placeEntityList).toHaveLength(98);
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
    describe('BoatracePlaceRepositoryFromHtmlImpl', () => {
        test('CI環境でテストをスキップ', () => {
            expect(true).toBe(true);
        });
    });
}
