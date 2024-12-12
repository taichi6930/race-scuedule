import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { AutoracePlaceDataUseCase } from '../../../../lib/src/usecase/implement/autoracePlaceDataUseCase';
import { baseAutoracePlaceEntity } from '../../mock/common/baseAutoraceData';
import { mockAutoracePlaceRepositoryFromHtmlImpl } from '../../mock/repository/autoracePlaceRepositoryFromHtmlImpl';
import { mockAutoracePlaceRepositoryFromStorageImpl } from '../../mock/repository/autoracePlaceRepositoryFromStorageImpl';

describe('AutoracePlaceDataUseCase', () => {
    let autoracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let autoracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let useCase: AutoracePlaceDataUseCase;

    beforeEach(() => {
        // autoracePlaceRepositoryFromStorageImplをコンテナに登録
        autoracePlaceRepositoryFromStorageImpl =
            mockAutoracePlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromStorage',
            {
                useValue: autoracePlaceRepositoryFromStorageImpl,
            },
        );

        autoracePlaceRepositoryFromHtmlImpl =
            mockAutoracePlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            {
                useValue: autoracePlaceRepositoryFromHtmlImpl,
            },
        );

        // AutoracePlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(AutoracePlaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            // モックの戻り値を設定
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<AutoracePlaceEntity>(
                    mockPlaceEntity,
                ),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            const result = await useCase.fetchPlaceEntityList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockPlaceEntity);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常にオートレース場データが更新されること', async () => {
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<AutoracePlaceEntity>(
                    mockPlaceEntity,
                ),
            );

            await useCase.updatePlaceEntityList(startDate, finishDate);

            expect(
                autoracePlaceRepositoryFromHtmlImpl.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                autoracePlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
