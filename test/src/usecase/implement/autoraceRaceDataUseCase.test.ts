import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { AutoraceRaceDataUseCase } from '../../../../lib/src/usecase/implement/autoraceRaceDataUseCase';
import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceStage,
} from '../../../../lib/src/utility/data/autorace';
import {
    baseAutoraceRaceDataList,
    baseAutoraceRaceEntity,
    baseAutoraceRaceEntityList,
} from '../../mock/common/baseAutoraceData';
import { mockAutoracePlaceRepositoryFromStorageImpl } from '../../mock/repository/autoracePlaceRepositoryFromStorageImpl';
import { mockAutoraceRaceRepositoryFromHtmlImpl } from '../../mock/repository/autoraceRaceRepositoryFromHtmlImpl';
import { mockAutoraceRaceRepositoryFromStorageImpl } from '../../mock/repository/autoraceRaceRepositoryFromStorageImpl';

describe('AutoraceRaceDataUseCase', () => {
    let autoraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let autoracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let useCase: AutoraceRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        autoraceRaceRepositoryFromStorageImpl =
            mockAutoraceRaceRepositoryFromStorageImpl();
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromStorage', {
            useValue: autoraceRaceRepositoryFromStorageImpl,
        });
        autoraceRaceRepositoryFromHtmlImpl =
            mockAutoraceRaceRepositoryFromHtmlImpl();
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', {
            useValue: autoraceRaceRepositoryFromHtmlImpl,
        });

        // autoracePlaceRepositoryFromStorageImplをコンテナに登録
        autoracePlaceRepositoryFromStorageImpl =
            mockAutoracePlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromStorage',
            {
                useValue: autoracePlaceRepositoryFromStorageImpl,
            },
        );

        // AutoraceRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(AutoraceRaceDataUseCase);
    });

    const baseRaceEntity = baseAutoraceRaceEntity;

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: AutoraceRaceData[] = baseAutoraceRaceDataList;
            const mockRaceEntity: AutoraceRaceEntity[] =
                baseAutoraceRaceEntityList;

            // モックの戻り値を設定
            autoraceRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<AutoraceRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });

        [
            {
                searchConditions: { gradeList: ['SG' as AutoraceGradeType] },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    locationList: ['飯塚' as AutoraceRaceCourse],
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    stageList: ['優勝戦' as AutoraceRaceStage],
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 5,
            },
            {
                searchConditions: {
                    gradeList: ['SG' as AutoraceGradeType],
                    locationList: ['飯塚' as AutoraceRaceCourse],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    gradeList: ['SG' as AutoraceGradeType],
                    locationList: ['川口' as AutoraceRaceCourse],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
            },
            {
                searchConditions: {
                    gradeList: ['SG' as AutoraceGradeType],
                    stageList: ['優勝戦' as AutoraceRaceStage],
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    locationList: ['飯塚' as AutoraceRaceCourse],
                    stageList: ['優勝戦' as AutoraceRaceStage],
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    gradeList: ['SG' as AutoraceGradeType],
                    locationList: ['飯塚' as AutoraceRaceCourse],
                    stageList: ['優勝戦' as AutoraceRaceStage],
                },
                descriptions: 'gradeとlocation、stageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {},
                descriptions: '検索条件なし',
                expectedLength: 60,
            },
        ].forEach(({ searchConditions, descriptions, expectedLength }) => {
            it(`正常にレースデータが取得できること（${descriptions}）`, async () => {
                const mockRaceEntity: AutoraceRaceEntity[] =
                    baseAutoraceRaceEntityList;

                // モックの戻り値を設定
                autoraceRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                    new FetchRaceListResponse<AutoraceRaceEntity>(
                        mockRaceEntity,
                    ),
                );

                const startDate = new Date('2025-12-01');
                const finishDate = new Date('2025-12-31');

                const result = await useCase.fetchRaceDataList(
                    startDate,
                    finishDate,
                    searchConditions,
                );

                expect(result.length).toBe(expectedLength);
            });
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceEntity: AutoraceRaceEntity[] = [baseRaceEntity];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            autoraceRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<AutoraceRaceEntity>(mockRaceEntity),
            );

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(
                autoracePlaceRepositoryFromStorageImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                autoraceRaceRepositoryFromHtmlImpl.fetchRaceList,
            ).toHaveBeenCalled();
            expect(
                autoraceRaceRepositoryFromStorageImpl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定（エラーが発生するように設定）
            autoraceRaceRepositoryFromHtmlImpl.fetchRaceList.mockRejectedValue(
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
            const mockRaceData: AutoraceRaceData[] = baseAutoraceRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(
                autoraceRaceRepositoryFromStorageImpl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceData: AutoraceRaceData[] = baseAutoraceRaceDataList;
            // モックの戻り値を設定（エラーが発生するように設定）
            autoraceRaceRepositoryFromStorageImpl.registerRaceList.mockRejectedValue(
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
