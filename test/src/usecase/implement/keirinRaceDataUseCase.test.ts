import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { KeirinRaceDataUseCase } from '../../../../lib/src/usecase/implement/keirinRaceDataUseCase';
import { mockKeirinPlaceRepositoryFromStorageImpl } from '../../mock/repository/keirinPlaceRepositoryFromStorageImpl';
import { mockKeirinRaceRepositoryFromHtmlImpl } from '../../mock/repository/keirinRaceRepositoryFromHtmlImpl';
import { mockKeirinRaceRepositoryFromStorageImpl } from '../../mock/repository/keirinRaceRepositoryFromStorageImpl';

describe('KeirinRaceDataUseCase', () => {
    let keirinRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<KeirinRaceData, KeirinPlaceData>
    >;
    let keirinRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<KeirinRaceData, KeirinPlaceData>
    >;
    let keirinPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceData>
    >;
    let useCase: KeirinRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        keirinRaceRepositoryFromStorageImpl =
            mockKeirinRaceRepositoryFromStorageImpl();
        container.register<IRaceRepository<KeirinRaceData, KeirinPlaceData>>(
            'KeirinRaceRepositoryFromStorage',
            {
                useValue: keirinRaceRepositoryFromStorageImpl,
            },
        );
        keirinRaceRepositoryFromHtmlImpl =
            mockKeirinRaceRepositoryFromHtmlImpl();
        container.register<IRaceRepository<KeirinRaceData, KeirinPlaceData>>(
            'KeirinRaceRepositoryFromHtml',
            {
                useValue: keirinRaceRepositoryFromHtmlImpl,
            },
        );

        // keirinPlaceRepositoryFromStorageImplをコンテナに登録
        keirinPlaceRepositoryFromStorageImpl =
            mockKeirinPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<KeirinPlaceData>>(
            'KeirinPlaceRepositoryFromStorage',
            {
                useValue: keirinPlaceRepositoryFromStorageImpl,
            },
        );

        // KeirinRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(KeirinRaceDataUseCase);
    });

    const baseRaceData = new KeirinRaceData(
        'KEIRINグランプリ',
        'グランプリ',
        new Date('2025-12-30 16:30'),
        '平塚',
        'GP',
        11,
    );

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: KeirinRaceData[] = [baseRaceData];

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceData>(mockRaceData),
            );

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: KeirinRaceData[] = [baseRaceData];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            keirinRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<KeirinRaceData>(mockRaceData),
            );

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(
                keirinPlaceRepositoryFromStorageImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromHtmlImpl.fetchRaceList,
            ).toHaveBeenCalled();
            expect(
                keirinRaceRepositoryFromStorageImpl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定（エラーが発生するように設定）
            keirinRaceRepositoryFromHtmlImpl.fetchRaceList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
