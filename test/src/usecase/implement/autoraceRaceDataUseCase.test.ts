import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { AutoraceRaceDataUseCase } from '../../../../lib/src/usecase/implement/autoraceRaceDataUseCase';
import {
    baseAutoracePlaceEntity,
    baseAutoraceRaceDataList,
    baseAutoraceRaceEntityList,
} from '../../mock/common/baseAutoraceData';
import { PlaceDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { RaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('AutoraceRaceDataUseCase', () => {
    let raceDataService: jest.Mocked<
        IRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let placeDataService: jest.Mocked<IPlaceDataService<AutoracePlaceEntity>>;
    let useCase: AutoraceRaceDataUseCase;

    beforeEach(() => {
        raceDataService = RaceDataServiceMock<
            AutoraceRaceEntity,
            AutoracePlaceEntity
        >();
        container.register<
            IRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceDataService', {
            useValue: raceDataService,
        });

        placeDataService = PlaceDataServiceMock<AutoracePlaceEntity>();
        container.register<IPlaceDataService<AutoracePlaceEntity>>(
            'AutoracePlaceDataService',
            {
                useValue: placeDataService,
            },
        );

        useCase = container.resolve(AutoraceRaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: AutoraceRaceData[] = baseAutoraceRaceDataList;
            const mockRaceEntity: AutoraceRaceEntity[] =
                baseAutoraceRaceEntityList;

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
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
                searchConditions: { gradeList: ['SG'] },
                descriptions: 'gradeを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    locationList: ['飯塚'],
                },
                descriptions: 'locationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    stageList: ['優勝戦'],
                },
                descriptions: 'stageを検索条件に入れて',
                expectedLength: 5,
            },
            {
                searchConditions: {
                    gradeList: ['SG'],
                    locationList: ['飯塚'],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    gradeList: ['SG'],
                    locationList: ['川口'],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 0,
            },
            {
                searchConditions: {
                    gradeList: ['SG'],
                    stageList: ['優勝戦'],
                },
                descriptions: 'gradeとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    locationList: ['飯塚'],
                    stageList: ['優勝戦'],
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    gradeList: ['SG'],
                    locationList: ['飯塚'],
                    stageList: ['優勝戦'],
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
                raceDataService.fetchRaceEntityList.mockResolvedValue(
                    mockRaceEntity,
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
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            const startDate = new Date('2024-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['SG'],
                locationList: ['飯塚'],
            };

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                baseAutoraceRaceEntityList,
            );
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });

        it('競輪場がない時、正常にレースデータが更新されないこと', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['SG'],
                locationList: ['飯塚'],
            };

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                baseAutoraceRaceEntityList,
            );
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).not.toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).not.toHaveBeenCalled();
        });

        it('検索条件がなく、正常にレースデータが更新されること', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {};

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                baseAutoraceRaceEntityList,
            );
            placeDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: AutoraceRaceData[] = baseAutoraceRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
