import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { KeirinRaceDataService } from '../../../../lib/src/service/implement/keirinRaceDataService';
import { baseKeirinRaceEntityList } from '../../mock/common/baseKeirinData';
import { mockKeirinPlaceRepositoryFromStorageImpl } from '../../mock/repository/keirinPlaceRepositoryFromStorageImpl';
import { mockKeirinRaceRepositoryFromHtmlImpl } from '../../mock/repository/keirinRaceRepositoryFromHtmlImpl';
import { mockKeirinRaceRepositoryFromStorageImpl } from '../../mock/repository/keirinRaceRepositoryFromStorageImpl';

describe('KeirinRaceDataService', () => {
    let keirinRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let keirinPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let service: KeirinRaceDataService;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        keirinRaceRepositoryFromStorageImpl =
            mockKeirinRaceRepositoryFromStorageImpl();
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromStorage', {
            useValue: keirinRaceRepositoryFromStorageImpl,
        });
        keirinRaceRepositoryFromHtmlImpl =
            mockKeirinRaceRepositoryFromHtmlImpl();
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useValue: keirinRaceRepositoryFromHtmlImpl,
        });

        // keirinPlaceRepositoryFromStorageImplをコンテナに登録
        keirinPlaceRepositoryFromStorageImpl =
            mockKeirinPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromStorage',
            {
                useValue: keirinPlaceRepositoryFromStorageImpl,
            },
        );

        // KeirinRaceCalendarServiceをコンテナから取得
        service = container.resolve(KeirinRaceDataService);
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレースデータが取得できること（storage）', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = baseKeirinRaceEntityList;

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

            expect(result).toEqual(mockRaceEntity);
        });
        it('正常にレースデータが取得できること（web）', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = baseKeirinRaceEntityList;

            // モックの戻り値を設定
            keirinRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                'web',
            );

            expect(result).toEqual(mockRaceEntity);
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchRaceEntityList(startDate, finishDate, 'storage');

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = baseKeirinRaceEntityList;

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceEntity>(mockRaceEntity),
            );

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レース数が0件の場合、更新処理が実行されないこと', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = [];

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = baseKeirinRaceEntityList;

            // モックの戻り値を設定（エラーが発生するように設定）
            keirinRaceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updateRaceEntityList(mockRaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
