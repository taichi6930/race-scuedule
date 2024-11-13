import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { KeirinPlaceDataUseCase } from '../../../../lib/src/usecase/implement/keirinPlaceDataUseCase';
import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
} from '../../mock/common/baseData';
import { mockKeirinPlaceRepositoryFromHtmlImpl } from '../../mock/repository/keirinPlaceRepositoryFromHtmlImpl';
import { mockKeirinPlaceRepositoryFromStorageImpl } from '../../mock/repository/keirinPlaceRepositoryFromStorageImpl';

describe('KeirinPlaceDataUseCase', () => {
    let keirinPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let keirinPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let useCase: KeirinPlaceDataUseCase;

    beforeEach(() => {
        // keirinPlaceRepositoryFromStorageImplをコンテナに登録
        keirinPlaceRepositoryFromStorageImpl =
            mockKeirinPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromStorage',
            {
                useValue: keirinPlaceRepositoryFromStorageImpl,
            },
        );

        keirinPlaceRepositoryFromHtmlImpl =
            mockKeirinPlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            {
                useValue: keirinPlaceRepositoryFromHtmlImpl,
            },
        );

        // KeirinPlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(KeirinPlaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceData: KeirinPlaceData[] = [baseKeirinPlaceData];
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            // モックの戻り値を設定
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceEntity>(mockPlaceEntity),
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
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceEntity: KeirinPlaceEntity[] = [
                baseKeirinPlaceEntity,
            ];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceEntity>(mockPlaceEntity),
            );

            await useCase.updatePlaceDataList(startDate, finishDate);

            expect(
                keirinPlaceRepositoryFromHtmlImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                keirinPlaceRepositoryFromStorageImpl.registerPlaceList,
            ).toHaveBeenCalled();
        });
    });
});
