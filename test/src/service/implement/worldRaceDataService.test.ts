import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { WorldRaceDataService } from '../../../../lib/src/service/implement/worldRaceDataService';
import { baseWorldRaceEntityList } from '../../mock/common/baseWorldData';
import { mockRaceRepository } from '../../mock/repository/mockRaceRepository';

describe('WorldRaceDataService', () => {
    let worldRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    let worldRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    let service: WorldRaceDataService;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        worldRaceRepositoryFromStorageImpl = mockRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >();
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromStorage',
            {
                useValue: worldRaceRepositoryFromStorageImpl,
            },
        );
        worldRaceRepositoryFromHtmlImpl = mockRaceRepository<
            WorldRaceEntity,
            WorldPlaceEntity
        >();
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromHtml',
            {
                useValue: worldRaceRepositoryFromHtmlImpl,
            },
        );

        // WorldRaceCalendarServiceをコンテナから取得
        service = container.resolve(WorldRaceDataService);
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレースデータが取得できること（storage）', async () => {
            const mockRaceEntity: WorldRaceEntity[] = baseWorldRaceEntityList;

            // モックの戻り値を設定
            worldRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<WorldRaceEntity>(mockRaceEntity),
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
            const mockRaceEntity: WorldRaceEntity[] = baseWorldRaceEntityList;

            // モックの戻り値を設定
            worldRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<WorldRaceEntity>(mockRaceEntity),
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
            worldRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
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
            const mockRaceEntity: WorldRaceEntity[] = baseWorldRaceEntityList;

            // モックの戻り値を設定
            worldRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<WorldRaceEntity>(mockRaceEntity),
            );

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                worldRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レース数が0件の場合、更新処理が実行されないこと', async () => {
            const mockRaceEntity: WorldRaceEntity[] = [];

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                worldRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceEntity: WorldRaceEntity[] = baseWorldRaceEntityList;

            // モックの戻り値を設定（エラーが発生するように設定）
            worldRaceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
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
