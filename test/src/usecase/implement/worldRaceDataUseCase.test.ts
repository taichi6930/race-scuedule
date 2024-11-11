import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { WorldRaceDataUseCase } from '../../../../lib/src/usecase/implement/worldRaceDataUseCase';
import { mockWorldRaceRepositoryFromHtmlImpl } from '../../mock/repository/worldRaceRepositoryFromHtmlImpl';
import { mockWorldRaceRepositoryFromStorageImpl } from '../../mock/repository/worldRaceRepositoryFromStorageImpl';

describe('WorldRaceDataUseCase', () => {
    let worldRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    let worldRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
    >;
    let useCase: WorldRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        worldRaceRepositoryFromStorageImpl =
            mockWorldRaceRepositoryFromStorageImpl();
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromStorage',
            {
                useValue: worldRaceRepositoryFromStorageImpl,
            },
        );
        worldRaceRepositoryFromHtmlImpl = mockWorldRaceRepositoryFromHtmlImpl();
        container.register<IRaceRepository<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceRepositoryFromHtml',
            {
                useValue: worldRaceRepositoryFromHtmlImpl,
            },
        );

        // WorldRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(WorldRaceDataUseCase);
    });

    const baseRaceData = new WorldRaceData(
        '凱旋門賞',
        new Date('2024-10-02 16:30'),
        'パリロンシャン',
        '芝',
        2400,
        'GⅠ',
        11,
    );
    const baseRaceEntity = new WorldRaceEntity(
        null,
        '凱旋門賞',
        new Date('2024-10-02 16:30'),
        'パリロンシャン',
        '芝',
        2400,
        'GⅠ',
        11,
    );

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: WorldRaceData[] = [baseRaceData];
            const mockRaceEntity: WorldRaceEntity[] = [baseRaceEntity];

            // モックの戻り値を設定
            worldRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<WorldRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceEntity: WorldRaceEntity[] = [baseRaceEntity];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            worldRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<WorldRaceEntity>(mockRaceEntity),
            );

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(
                worldRaceRepositoryFromHtmlImpl.fetchRaceList,
            ).toHaveBeenCalled();
            expect(
                worldRaceRepositoryFromStorageImpl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定（エラーが発生するように設定）
            worldRaceRepositoryFromHtmlImpl.fetchRaceList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
