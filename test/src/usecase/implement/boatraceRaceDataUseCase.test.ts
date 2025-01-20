import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { BoatraceRaceDataUseCase } from '../../../../lib/src/usecase/implement/boatraceRaceDataUseCase';
import {
    baseBoatracePlaceEntity,
    baseBoatraceRaceDataList,
    baseBoatraceRaceEntityList,
} from '../../mock/common/baseBoatraceData';
import { mockBoatracePlaceDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { mockBoatraceRaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('BoatraceRaceDataUseCase', () => {
    let boatraceRaceDataService: jest.Mocked<
        IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let boatracePlaceDataService: jest.Mocked<
        IPlaceDataService<BoatracePlaceEntity>
    >;
    let useCase: BoatraceRaceDataUseCase;

    beforeEach(() => {
        // BoatraceRaceDataServiceをコンテナに登録
        boatraceRaceDataService = mockBoatraceRaceDataServiceMock();
        container.register<
            IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceDataService', {
            useValue: boatraceRaceDataService,
        });

        // BoatracePlaceDataServiceをコンテナに登録
        boatracePlaceDataService = mockBoatracePlaceDataServiceMock();
        container.register<IPlaceDataService<BoatracePlaceEntity>>(
            'BoatracePlaceDataService',
            {
                useValue: boatracePlaceDataService,
            },
        );

        // BoatraceRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(BoatraceRaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: BoatraceRaceData[] = baseBoatraceRaceDataList;
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

            // モックの戻り値を設定
            boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
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
                    locationList: ['平和島'],
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
                    locationList: ['平和島'],
                },
                descriptions: 'gradeとlocationを検索条件に入れて',
                expectedLength: 12,
            },
            {
                searchConditions: {
                    gradeList: ['SG'],
                    locationList: ['桐生'],
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
                    locationList: ['平和島'],
                    stageList: ['優勝戦'],
                },
                descriptions: 'locationとstageを検索条件に入れて',
                expectedLength: 1,
            },
            {
                searchConditions: {
                    gradeList: ['SG'],
                    locationList: ['平和島'],
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
                const mockRaceEntity: BoatraceRaceEntity[] =
                    baseBoatraceRaceEntityList;

                // モックの戻り値を設定
                boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
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
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
            ];

            const startDate = new Date('2024-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['SG'],
                locationList: ['平和島'],
            };

            // モックの戻り値を設定
            boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
                baseBoatraceRaceEntityList,
            );
            boatracePlaceDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(
                boatracePlaceDataService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                boatraceRaceDataService.fetchRaceEntityList,
            ).toHaveBeenCalled();
            expect(
                boatraceRaceDataService.updateRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('競輪場がない時、正常にレースデータが更新されないこと', async () => {
            const mockPlaceEntity: BoatracePlaceEntity[] = [];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {
                gradeList: ['SG'],
                locationList: ['平和島'],
            };

            // モックの戻り値を設定
            boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
                baseBoatraceRaceEntityList,
            );
            boatracePlaceDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(
                boatracePlaceDataService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                boatraceRaceDataService.fetchRaceEntityList,
            ).not.toHaveBeenCalled();
            expect(
                boatraceRaceDataService.updateRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('検索条件がなく、正常にレースデータが更新されること', async () => {
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
            ];
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');
            const searchList = {};

            // モックの戻り値を設定
            boatraceRaceDataService.fetchRaceEntityList.mockResolvedValue(
                baseBoatraceRaceEntityList,
            );
            boatracePlaceDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updateRaceEntityList(
                startDate,
                finishDate,
                searchList,
            );

            expect(
                boatracePlaceDataService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                boatraceRaceDataService.fetchRaceEntityList,
            ).toHaveBeenCalled();
            expect(
                boatraceRaceDataService.updateRaceEntityList,
            ).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: BoatraceRaceData[] = baseBoatraceRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(
                boatraceRaceDataService.updateRaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
