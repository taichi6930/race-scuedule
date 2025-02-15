import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { BoatracePlaceDataUseCase } from '../../../../lib/src/usecase/implement/boatracePlaceDataUseCase';
import {
    baseBoatracePlaceData,
    baseBoatracePlaceEntity,
} from '../../mock/common/baseBoatraceData';
import { PlaceDataServiceMock } from '../../mock/service/placeDataServiceMock';

describe('BoatracePlaceDataUseCase', () => {
    let boatracePlaceDataService: jest.Mocked<
        IPlaceDataService<BoatracePlaceEntity>
    >;
    let useCase: BoatracePlaceDataUseCase;

    beforeEach(() => {
        // BoatracePlaceDataServiceをコンテナに登録
        boatracePlaceDataService = PlaceDataServiceMock<BoatracePlaceEntity>();
        container.register<IPlaceDataService<BoatracePlaceEntity>>(
            'BoatracePlaceDataService',
            {
                useValue: boatracePlaceDataService,
            },
        );

        // BoatracePlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(BoatracePlaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceData: BoatracePlaceData[] = [baseBoatracePlaceData];
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
            ];

            // モックの戻り値を設定
            boatracePlaceDataService.fetchPlaceEntityList.mockResolvedValue(
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
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
            ];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            boatracePlaceDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updatePlaceDataList(startDate, finishDate);

            expect(
                boatracePlaceDataService.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                boatracePlaceDataService.updatePlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
