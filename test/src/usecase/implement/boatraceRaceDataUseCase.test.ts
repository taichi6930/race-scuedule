import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { BoatraceRaceDataUseCase } from '../../../../lib/src/usecase/implement/boatraceRaceDataUseCase';
import type {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from '../../../../lib/src/utility/data/boatrace';
import {
    baseBoatraceRaceDataList,
    baseBoatraceRaceEntity,
    baseBoatraceRaceEntityList,
} from '../../mock/common/baseBoatraceData';
import { mockBoatracePlaceRepositoryFromStorageImpl } from '../../mock/repository/boatracePlaceRepositoryFromStorageImpl';
import { mockBoatraceRaceRepositoryFromHtmlImpl } from '../../mock/repository/boatraceRaceRepositoryFromHtmlImpl';
import { mockBoatraceRaceRepositoryFromStorageImpl } from '../../mock/repository/boatraceRaceRepositoryFromStorageImpl';

describe('BoatraceRaceDataUseCase', () => {
    let boatraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let boatraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let boatracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let useCase: BoatraceRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        boatraceRaceRepositoryFromStorageImpl =
            mockBoatraceRaceRepositoryFromStorageImpl();
        container.register<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceRepositoryFromStorage', {
            useValue: boatraceRaceRepositoryFromStorageImpl,
        });
        boatraceRaceRepositoryFromHtmlImpl =
            mockBoatraceRaceRepositoryFromHtmlImpl();
        container.register<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceRepositoryFromHtml', {
            useValue: boatraceRaceRepositoryFromHtmlImpl,
        });

        // boatracePlaceRepositoryFromStorageImplをコンテナに登録
        boatracePlaceRepositoryFromStorageImpl =
            mockBoatracePlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromStorage',
            {
                useValue: boatracePlaceRepositoryFromStorageImpl,
            },
        );

        // BoatraceRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(BoatraceRaceDataUseCase);
    });

    const baseRaceEntity = baseBoatraceRaceEntity;

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: BoatraceRaceData[] = baseBoatraceRaceDataList;
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

            // モックの戻り値を設定
            boatraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<BoatraceRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceEntityList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });

        [
            {
                searchConditions: { gradeList: ['SG' as BoatraceGradeType] },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    locationList: ['平和島' as BoatraceRaceCourse],
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    stageList: ['優勝戦' as BoatraceRaceStage],
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 5,
            },
            {
                searchConditions: {
                    gradeList: ['SG' as BoatraceGradeType],
                    locationList: ['平和島' as BoatraceRaceCourse],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    gradeList: ['SG' as BoatraceGradeType],
                    locationList: ['桐生' as BoatraceRaceCourse],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
            },
            {
                searchConditions: {
                    gradeList: ['SG' as BoatraceGradeType],
                    stageList: ['優勝戦' as BoatraceRaceStage],
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    locationList: ['平和島' as BoatraceRaceCourse],
                    stageList: ['優勝戦' as BoatraceRaceStage],
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    gradeList: ['SG' as BoatraceGradeType],
                    locationList: ['平和島' as BoatraceRaceCourse],
                    stageList: ['優勝戦' as BoatraceRaceStage],
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
                const mockRaceEntity: BoatraceRaceEntity[] =
                    baseBoatraceRaceEntityList;

                // モックの戻り値を設定
                boatraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                    new FetchRaceListResponse<BoatraceRaceEntity>(
                        mockRaceEntity,
                    ),
                );

                const startDate = new Date('2025-12-01');
                const finishDate = new Date('2025-12-31');

                const result = await useCase.fetchRaceEntityList(
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
            const mockRaceEntity: BoatraceRaceEntity[] = [baseRaceEntity];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            boatraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<BoatraceRaceEntity>(mockRaceEntity),
            );

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(
                boatracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                boatraceRaceRepositoryFromHtmlImpl.fetchRaceEntityList,
            ).toHaveBeenCalled();
            expect(
                boatraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定（エラーが発生するように設定）
            boatraceRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockRejectedValue(
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
            const mockRaceData: BoatraceRaceData[] = baseBoatraceRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(
                boatraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceData: BoatraceRaceData[] = baseBoatraceRaceDataList;
            // モックの戻り値を設定（エラーが発生するように設定）
            boatraceRaceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
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
