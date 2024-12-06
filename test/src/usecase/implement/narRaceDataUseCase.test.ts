import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { NarRaceDataUseCase } from '../../../../lib/src/usecase/implement/narRaceDataUseCase';
import {
    baseNarRaceDataList,
    baseNarRaceEntity,
    baseNarRaceEntityList,
} from '../../mock/common/baseNarData';
import { mockNarPlaceRepositoryFromStorageImpl } from '../../mock/repository/narPlaceRepositoryFromStorageImpl';
import { mockNarRaceRepositoryFromHtmlImpl } from '../../mock/repository/narRaceRepositoryFromHtmlImpl';
import { mockNarRaceRepositoryFromStorageImpl } from '../../mock/repository/narRaceRepositoryFromStorageImpl';

describe('NarRaceDataUseCase', () => {
    let narRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<NarRaceEntity, NarPlaceEntity>
    >;
    let narRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<NarRaceEntity, NarPlaceEntity>
    >;
    let narPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let useCase: NarRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        narRaceRepositoryFromStorageImpl =
            mockNarRaceRepositoryFromStorageImpl();
        container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceRepositoryFromStorage',
            {
                useValue: narRaceRepositoryFromStorageImpl,
            },
        );
        narRaceRepositoryFromHtmlImpl = mockNarRaceRepositoryFromHtmlImpl();
        container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceRepositoryFromHtml',
            {
                useValue: narRaceRepositoryFromHtmlImpl,
            },
        );

        // narPlaceRepositoryFromStorageImplをコンテナに登録
        narPlaceRepositoryFromStorageImpl =
            mockNarPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromStorage',
            {
                useValue: narPlaceRepositoryFromStorageImpl,
            },
        );

        // NarRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(NarRaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: NarRaceData[] = baseNarRaceDataList;
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

            // モックの戻り値を設定
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<NarRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });

        it('正常にレースデータが取得できること（gradeを検索条件に入れて）', async () => {
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

            // モックの戻り値を設定
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<NarRaceEntity>(mockRaceEntity),
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
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

            // モックの戻り値を設定
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<NarRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { locationList: ['大井'] },
            );

            // レース数が12件であることを確認
            expect(result.length).toBe(12);
        });

        it('正常にレースデータが取得できること（grade, locationを検索条件に入れて）', async () => {
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

            // モックの戻り値を設定
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<NarRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { gradeList: ['GⅠ'], locationList: ['大井'] },
            );

            // レース数が1件であることを確認
            expect(result.length).toBe(1);
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceEntity: NarRaceEntity[] = [baseNarRaceEntity];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            narRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<NarRaceEntity>(mockRaceEntity),
            );

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(
                narPlaceRepositoryFromStorageImpl.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                narRaceRepositoryFromHtmlImpl.fetchRaceEntityList,
            ).toHaveBeenCalled();
            expect(
                narRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定（エラーが発生するように設定）
            narRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: NarRaceData[] = baseNarRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(
                narRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceData: NarRaceData[] = baseNarRaceDataList;
            // モックの戻り値を設定（エラーが発生するように設定）
            narRaceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
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
