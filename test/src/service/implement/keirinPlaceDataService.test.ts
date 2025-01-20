import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { KeirinPlaceDataService } from '../../../../lib/src/service/implement/keirinPlaceDataService';
import { baseKeirinPlaceEntity } from '../../mock/common/baseKeirinData';
import { mockKeirinPlaceRepositoryFromHtmlImpl } from '../../mock/repository/keirinPlaceRepositoryFromHtmlImpl';
import { mockKeirinPlaceRepositoryFromStorageImpl } from '../../mock/repository/keirinPlaceRepositoryFromStorageImpl';

describe('KeirinPlaceDataService', () => {
    let keirinPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let keirinPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let service: KeirinPlaceDataService;

    beforeEach(() => {
        // keirinPlaceRepositoryFromStorageImplをコンテナに登録
        keirinPlaceRepositoryFromStorageImpl =
            mockKeirinPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromStorage',
            {
                useValue: keirinPlaceRepositoryFromStorageImpl,
            },
        );

        keirinPlaceRepositoryFromHtmlImpl =
            mockKeirinPlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            {
                useValue: keirinPlaceRepositoryFromHtmlImpl,
            },
        );

        // KeirinPlaceCalendarServiceをコンテナから取得
        service = container.resolve(KeirinPlaceDataService);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること(storage)', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            // モックの戻り値を設定
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceEntity>(mockPlaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('正常にレースデータが取得できること（web）', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            // モックの戻り値を設定
            keirinPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceEntity>(mockPlaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                'web',
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            // モックの戻り値を設定
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceEntity>(mockPlaceEntity),
            );

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(
                keirinPlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('件数0の場合、エラーが発生すること', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [];

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('競馬場データが取得できない場合、エラーが発生すること', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];
            // モックの戻り値を設定（エラーが発生するように設定）
            keirinPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('競馬場データの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
