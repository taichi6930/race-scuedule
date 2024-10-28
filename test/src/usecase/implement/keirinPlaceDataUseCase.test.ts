import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { KeirinPlaceDataUseCase } from '../../../../lib/src/usecase/implement/keirinPlaceDataUseCase';
import { mockKeirinPlaceRepositoryFromHtmlImpl } from '../../mock/repository/keirinPlaceRepositoryFromHtmlImpl';
import { mockKeirinPlaceRepositoryFromStorageImpl } from '../../mock/repository/keirinPlaceRepositoryFromStorageImpl';

describe('KeirinPlaceDataUseCase', () => {
    let keirinPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceData>
    >;
    let keirinPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceData>
    >;
    let useCase: KeirinPlaceDataUseCase;

    beforeEach(() => {
        // keirinPlaceRepositoryFromStorageImplをコンテナに登録
        keirinPlaceRepositoryFromStorageImpl =
            mockKeirinPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<KeirinPlaceData>>(
            'KeirinPlaceRepositoryFromStorage',
            {
                useValue: keirinPlaceRepositoryFromStorageImpl,
            },
        );

        keirinPlaceRepositoryFromHtmlImpl =
            mockKeirinPlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<KeirinPlaceData>>(
            'KeirinPlaceRepositoryFromHtml',
            {
                useValue: keirinPlaceRepositoryFromHtmlImpl,
            },
        );

        // KeirinPlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(KeirinPlaceDataUseCase);
    });

    const basePlaceData = new KeirinPlaceData(
        new Date('2025-12-30'),
        '平塚',
        'GP',
    );

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceData: KeirinPlaceData[] = [basePlaceData];

            // モックの戻り値を設定
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceData>(mockPlaceData),
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
            const mockPlaceData: KeirinPlaceData[] = [basePlaceData];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            keirinPlaceRepositoryFromStorageImpl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<KeirinPlaceData>(mockPlaceData),
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
