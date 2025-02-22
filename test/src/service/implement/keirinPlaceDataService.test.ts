import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { KeirinPlaceDataService } from '../../../../lib/src/service/implement/keirinPlaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseKeirinPlaceEntity } from '../../mock/common/baseKeirinData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';

describe('KeirinPlaceDataService', () => {
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let placeRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let service: KeirinPlaceDataService;

    beforeEach(() => {
        placeRepositoryFromStorageImpl =
            mockPlaceRepository<KeirinPlaceEntity>();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromStorage',
            {
                useValue: placeRepositoryFromStorageImpl,
            },
        );

        placeRepositoryFromHtmlImpl = mockPlaceRepository();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            {
                useValue: placeRepositoryFromHtmlImpl,
            },
        );

        service = container.resolve(KeirinPlaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常に開催場データが取得できること(storage)', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            // モックの戻り値を設定
            placeRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('正常に開催場データが取得できること（web）', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            // モックの戻り値を設定
            placeRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('開催場データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            placeRepositoryFromStorageImpl.fetchPlaceEntityList.mockRejectedValue(
                new Error('開催場データの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に開催場データが更新されること', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            // モックの戻り値を設定
            placeRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(
                placeRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('開催場データの件数が0の場合、Repositoryを呼び出さないこと', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [];

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(
                placeRepositoryFromStorageImpl.registerPlaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('開催場データが更新できない場合、エラーが発生すること', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];
            // モックの戻り値を設定（エラーが発生するように設定）
            placeRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('開催場データの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
