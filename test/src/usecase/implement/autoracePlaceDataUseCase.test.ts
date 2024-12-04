import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { AutoracePlaceDataUseCase } from '../../../../lib/src/usecase/implement/autoracePlaceDataUseCase';
import {
    baseAutoracePlaceData,
    baseAutoracePlaceEntity,
} from '../../mock/common/baseAutoraceData';
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
            const mockPlaceData: AutoracePlaceData[] = [baseAutoracePlaceData];
            const mockPlaceEntity: AutoracePlaceEntity[] = [
                baseAutoracePlaceEntity,
            ];

            // モックの戻り値を設定
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<AutoracePlaceEntity>(
                    mockPlaceEntity,
                ),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            const result = await useCase.fetchPlaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockPlaceData);
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
            autoracePlaceRepositoryFromStorageImpl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<AutoracePlaceEntity>(
                    mockPlaceEntity,
                ),
            );

            await useCase.updatePlaceDataList(startDate, finishDate);

            expect(
                autoracePlaceRepositoryFromHtmlImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                autoracePlaceRepositoryFromStorageImpl.registerPlaceList,
            ).toHaveBeenCalled();
        });
    });
});
