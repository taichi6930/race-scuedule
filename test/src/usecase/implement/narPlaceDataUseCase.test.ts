import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';
import { NarPlaceDataUseCase } from '../../../../lib/src/usecase/implement/narPlaceDataUseCase';
import {
    baseNarPlaceData,
    baseNarPlaceEntity,
} from '../../mock/common/baseNarData';
import { mockNarPlaceDataServiceMock } from '../../mock/service/placeDataServiceMock';

describe('NarPlaceDataUseCase', () => {
    let narPlaceDataService: jest.Mocked<IPlaceDataService<NarPlaceEntity>>;
    let useCase: NarPlaceDataUseCase;

    beforeEach(() => {
        // NarPlaceDataServiceをコンテナに登録
        narPlaceDataService = mockNarPlaceDataServiceMock();
        container.register<IPlaceDataService<NarPlaceEntity>>(
            'NarPlaceDataService',
            {
                useValue: narPlaceDataService,
            },
        );

        // NarPlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(NarPlaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceData: NarPlaceData[] = [baseNarPlaceData];
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];

            // モックの戻り値を設定
            narPlaceDataService.fetchPlaceEntityList.mockResolvedValue(
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
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            narPlaceDataService.fetchPlaceEntityList.mockResolvedValue(
                mockPlaceEntity,
            );

            await useCase.updatePlaceDataList(startDate, finishDate);

            expect(narPlaceDataService.fetchPlaceEntityList).toHaveBeenCalled();
            expect(
                narPlaceDataService.updatePlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
