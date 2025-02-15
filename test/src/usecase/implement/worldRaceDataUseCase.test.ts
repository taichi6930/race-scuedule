import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { WorldRaceDataUseCase } from '../../../../lib/src/usecase/implement/worldRaceDataUseCase';
import {
    baseWorldRaceDataList,
    baseWorldRaceEntity,
    baseWorldRaceEntityList,
} from '../../mock/common/baseWorldData';
import { RaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('WorldRaceDataUseCase', () => {
    let raceDataService: jest.Mocked<
        IRaceDataService<WorldRaceEntity, WorldPlaceEntity>
    >;
    let useCase: WorldRaceDataUseCase;

    beforeEach(() => {
        raceDataService = RaceDataServiceMock<
            WorldRaceEntity,
            WorldPlaceEntity
        >();
        container.register<IRaceDataService<WorldRaceEntity, WorldPlaceEntity>>(
            'WorldRaceDataService',
            {
                useValue: raceDataService,
            },
        );

        useCase = container.resolve(WorldRaceDataUseCase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: WorldRaceData[] = baseWorldRaceDataList;
            const mockRaceEntity: WorldRaceEntity[] = baseWorldRaceEntityList;

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
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
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
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
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
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
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
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
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: WorldRaceData[] = baseWorldRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
