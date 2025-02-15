import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { AutoracePlaceDataUseCase } from '../../../../lib/src/usecase/implement/autoracePlaceDataUseCase';
import {
    baseAutoracePlaceData,
    baseAutoracePlaceEntity,
} from '../../mock/common/baseAutoraceData';
import { PlaceDataServiceMock } from '../../mock/service/placeDataServiceMock';

describe('AutoracePlaceDataUseCase', () => {
    let autoracePlaceDataService: jest.Mocked<
        IPlaceDataService<AutoracePlaceEntity>
    >;
    let useCase: AutoracePlaceDataUseCase;

    beforeEach(() => {
        // AutoracePlaceDataServiceをコンテナに登録
        autoracePlaceDataService = PlaceDataServiceMock<AutoracePlaceEntity>();
        container.register<IPlaceDataService<AutoracePlaceEntity>>(
            'AutoracePlaceDataService',
            {
                useValue: autoracePlaceDataService,
            },
        );

        // AutoracePlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(AutoracePlaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceData: AutoracePlaceData[] = [baseAutoracePlaceData];
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            // モックの戻り値を設定
            autoracePlaceDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockPlaceData);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に競輪場データが更新されること', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            autoracePlaceDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updatePlaceDataList(startDate, finishDate);

            expect(
                autoracePlaceDataService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                autoracePlaceDataService.updatePlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
