import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { WorldRaceDataUseCase } from '../../../../lib/src/usecase/implement/worldRaceDataUseCase';
import {
    baseWorldRaceDataList,
    baseWorldRaceEntity,
    baseWorldRaceEntityList,
} from '../../mock/common/baseData';
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

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: WorldRaceData[] = baseWorldRaceDataList;
            const mockRaceEntity: WorldRaceEntity[] = baseWorldRaceEntityList;

            // モックの戻り値を設定
            worldRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<WorldRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-10-01');
            const finishDate = new Date('2024-10-31');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });

        it('正常にレースデータが取得できること（gradeを検索条件に入れて）', async () => {
            const mockRaceEntity: WorldRaceEntity[] = baseWorldRaceEntityList;

            // モックの戻り値を設定
            worldRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<WorldRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { gradeList: ['GⅠ'] },
            );

            // レース数が2件であることを確認
            expect(result.length).toBe(2);
        });

        it('正常にレースデータが取得できること（locationを検索条件に入れて）', async () => {
            const mockRaceEntity: WorldRaceEntity[] = baseWorldRaceEntityList;

            // モックの戻り値を設定
            worldRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<WorldRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { locationList: ['パリロンシャン'] },
            );

            // レース数が12件であることを確認
            expect(result.length).toBe(12);
        });

        it('正常にレースデータが取得できること（grade, locationを検索条件に入れて）', async () => {
            const mockRaceEntity: WorldRaceEntity[] = baseWorldRaceEntityList;

            // モックの戻り値を設定
            worldRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<WorldRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { gradeList: ['GⅠ'], locationList: ['パリロンシャン'] },
            );

            // レース数が1件であることを確認
            expect(result.length).toBe(1);
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceEntity: WorldRaceEntity[] = [baseWorldRaceEntity];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

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
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

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

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: WorldRaceData[] = baseWorldRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(
                worldRaceRepositoryFromStorageImpl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceData: WorldRaceData[] = baseWorldRaceDataList;
            // モックの戻り値を設定（エラーが発生するように設定）
            worldRaceRepositoryFromHtmlImpl.registerRaceList.mockRejectedValue(
                new Error('レースデータの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.upsertRaceDataList(mockRaceData);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
