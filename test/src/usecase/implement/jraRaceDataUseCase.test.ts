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
import { mockJraRaceDataServiceMock } from '../../mock/service/raceDataServiceMock';

describe('JraRaceDataUseCase', () => {
    let jraPlaceDataService: jest.Mocked<IPlaceDataService<JraPlaceEntity>>;
    let jraRaceDataService: jest.Mocked<
        IRaceDataService<JraRaceEntity, JraPlaceEntity>
    >;
    let useCase: JraRaceDataUseCase;

    beforeEach(() => {
        // JraPlaceDataServiceをコンテナに登録
        jraPlaceDataService = PlaceDataServiceMock<JraPlaceEntity>();
        container.register<IPlaceDataService<JraPlaceEntity>>(
            'JraPlaceDataService',
            {
                useValue: jraPlaceDataService,
            },
        );
        // JraRaceDataServiceをコンテナに登録
        jraRaceDataService = mockJraRaceDataServiceMock();
        container.register<IRaceDataService<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceDataService',
            {
                useValue: jraRaceDataService,
            },
        );

        // JraRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(JraRaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: JraRaceData[] = baseJraRaceDataList;
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            jraRaceDataService.fetchRaceEntityList.mockResolvedValue(
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
            jraRaceDataService.fetchRaceEntityList.mockResolvedValue(
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
            jraRaceDataService.fetchRaceEntityList.mockResolvedValue(
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
            jraRaceDataService.fetchRaceEntityList.mockResolvedValue(
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
            jraRaceDataService.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(jraPlaceDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(jraRaceDataService.fetchRaceEntityList).toHaveBeenCalled();
            expect(jraRaceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: JraRaceData[] = baseJraRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(jraRaceDataService.updateRaceEntityList).toHaveBeenCalled();
        });
    });
});
