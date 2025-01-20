import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { AutoracePlaceDataService } from '../../../../lib/src/service/implement/autoracePlaceDataService';
import { baseAutoracePlaceEntity } from '../../mock/common/baseAutoraceData';
import { mockAutoracePlaceRepositoryFromHtmlImpl } from '../../mock/repository/autoracePlaceRepositoryFromHtmlImpl';
import { mockAutoracePlaceRepositoryFromStorageImpl } from '../../mock/repository/autoracePlaceRepositoryFromStorageImpl';

describe('AutoracePlaceDataService', () => {
    let autoracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let autoracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let service: AutoracePlaceDataService;

    beforeEach(() => {
        // autoracePlaceRepositoryFromStorageImplをコンテナに登録
        autoracePlaceRepositoryFromStorageImpl =
            mockAutoracePlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromStorage',
            {
                useValue: autoracePlaceRepositoryFromStorageImpl,
            },
        );

        autoracePlaceRepositoryFromHtmlImpl =
            mockAutoracePlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            {
                useValue: autoracePlaceRepositoryFromHtmlImpl,
            },
        );

        // AutoracePlaceCalendarServiceをコンテナから取得
        service = container.resolve(AutoracePlaceDataService);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること(storage)', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            // モックの戻り値を設定
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<AutoracePlaceEntity>(
                    mockPlaceEntity,
                ),
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
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            // モックの戻り値を設定
            autoracePlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<AutoracePlaceEntity>(
                    mockPlaceEntity,
                ),
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
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockRejectedValue(
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
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            // モックの戻り値を設定
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<AutoracePlaceEntity>(
                    mockPlaceEntity,
                ),
            );

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(
                autoracePlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('件数0の場合、エラーが発生すること', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [];

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('競馬場データが取得できない場合、エラーが発生すること', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];
            // モックの戻り値を設定（エラーが発生するように設定）
            autoracePlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
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
