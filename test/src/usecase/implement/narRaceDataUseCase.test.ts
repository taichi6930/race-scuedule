import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { NarRaceDataUseCase } from '../../../../lib/src/usecase/implement/narRaceDataUseCase';
import {
    baseNarRaceDataList,
    baseNarRaceEntity,
    baseNarRaceEntityList,
} from '../../mock/common/baseNarData';
import { mockNarPlaceDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { mockNarRaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('NarRaceDataUseCase', () => {
    let narPlaceDataService: jest.Mocked<IPlaceDataService<NarPlaceEntity>>;
    let narRaceDataService: jest.Mocked<
        IRaceDataService<NarRaceEntity, NarPlaceEntity>
    >;
    let useCase: NarRaceDataUseCase;

    beforeEach(() => {
        // NarPlaceDataServiceをコンテナに登録
        narPlaceDataService = mockNarPlaceDataServiceMock();
        container.register<IPlaceDataService<NarPlaceEntity>>(
            'NarPlaceDataService',
            {
                useValue: narPlaceDataService,
            },
        );
        // NarRaceDataServiceをコンテナに登録
        narRaceDataService = mockNarRaceDataServiceMock();
        container.register<IRaceDataService<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceDataService',
            {
                useValue: narRaceDataService,
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
            narRaceDataService.fetchRaceEntityList.mockResolvedValue(
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

        it('正常にレースデータが取得できること（gradeを検索条件に入れて）', async () => {
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

            // モックの戻り値を設定
            narRaceDataService.fetchRaceEntityList.mockResolvedValue(
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
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

            // モックの戻り値を設定
            narRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
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
            narRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
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
            narRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(narPlaceDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(narRaceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(narRaceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: NarRaceData[] = baseNarRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(narRaceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
