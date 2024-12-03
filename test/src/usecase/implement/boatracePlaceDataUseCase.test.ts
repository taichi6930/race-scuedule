import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { BoatracePlaceDataUseCase } from '../../../../lib/src/usecase/implement/boatracePlaceDataUseCase';
import {
    baseBoatracePlaceData,
    baseBoatracePlaceEntity,
} from '../../mock/common/baseData';
import { mockBoatracePlaceRepositoryFromHtmlImpl } from '../../mock/repository/boatracePlaceRepositoryFromHtmlImpl';
import { mockBoatracePlaceRepositoryFromStorageImpl } from '../../mock/repository/boatracePlaceRepositoryFromStorageImpl';

describe('BoatracePlaceDataUseCase', () => {
    let boatracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let boatracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let useCase: BoatracePlaceDataUseCase;

    beforeEach(() => {
        // boatracePlaceRepositoryFromStorageImplをコンテナに登録
        boatracePlaceRepositoryFromStorageImpl =
            mockBoatracePlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromStorage',
            {
                useValue: boatracePlaceRepositoryFromStorageImpl,
            },
        );

        boatracePlaceRepositoryFromHtmlImpl =
            mockBoatracePlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            {
                useValue: boatracePlaceRepositoryFromHtmlImpl,
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
            boatracePlaceRepositoryFromStorageImpl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<BoatracePlaceEntity>(
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
        it('正常にボートレース場データが更新されること', async () => {
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
            ];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            boatracePlaceRepositoryFromStorageImpl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<BoatracePlaceEntity>(
                    mockPlaceEntity,
                ),
            );

            await useCase.updatePlaceDataList(startDate, finishDate);

            expect(
                boatracePlaceRepositoryFromHtmlImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                boatracePlaceRepositoryFromStorageImpl.registerPlaceList,
            ).toHaveBeenCalled();
        });
    });
});
