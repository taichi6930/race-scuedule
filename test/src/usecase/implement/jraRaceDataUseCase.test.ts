import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { JraRaceDataUseCase } from '../../../../lib/src/usecase/implement/jraRaceDataUseCase';
import {
    baseJraRaceDataList,
    baseJraRaceEntity,
    baseJraRaceEntityList,
} from '../../mock/common/baseJraData';
import { PlaceDataServiceMock } from '../../mock/service/placeDataServiceMock';
import { RaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('JraRaceDataUseCase', () => {
    let placeDataService: jest.Mocked<IPlaceDataService<JraPlaceEntity>>;
    let raceDataService: jest.Mocked<
        IRaceDataService<JraRaceEntity, JraPlaceEntity>
    >;
    let useCase: JraRaceDataUseCase;

    beforeEach(() => {
        // PlaceDataServiceをコンテナに登録
        placeDataService = PlaceDataServiceMock<JraPlaceEntity>();
        container.register<IPlaceDataService<JraPlaceEntity>>(
            'JraPlaceDataService',
            {
                useValue: placeDataService,
            },
        );
        // RaceDataServiceをコンテナに登録
        raceDataService = RaceDataServiceMock<JraRaceEntity, JraPlaceEntity>();
        container.register<IRaceDataService<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceDataService',
            {
                useValue: raceDataService,
            },
        );

        // RaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(JraRaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: JraRaceData[] = baseJraRaceDataList;
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

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

        it('正常にレースデータが取得できること（gradeを検索条件に入れて）', async () => {
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

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
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { locationList: ['東京'] },
            );

            // レース数が12件であることを確認
            expect(result.length).toBe(12);
        });

        it('正常にレースデータが取得できること（grade, locationを検索条件に入れて）', async () => {
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { gradeList: ['GⅠ'], locationList: ['東京'] },
            );

            // レース数が1件であることを確認
            expect(result.length).toBe(1);
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceEntity: JraRaceEntity[] = [baseJraRaceEntity];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            raceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(placeDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(raceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: JraRaceData[] = baseJraRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(raceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
