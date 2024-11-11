import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { AutoraceRaceDataUseCase } from '../../../../lib/src/usecase/implement/autoraceRaceDataUseCase';
import {
    baseAutoraceRaceData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseData';
import { mockAutoracePlaceRepositoryFromStorageImpl } from '../../mock/repository/autoracePlaceRepositoryFromStorageImpl';
import { mockAutoraceRaceRepositoryFromHtmlImpl } from '../../mock/repository/autoraceRaceRepositoryFromHtmlImpl';
import { mockAutoraceRaceRepositoryFromStorageImpl } from '../../mock/repository/autoraceRaceRepositoryFromStorageImpl';

describe('AutoraceRaceDataUseCase', () => {
    let autoraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let autoracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let useCase: AutoraceRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        autoraceRaceRepositoryFromStorageImpl =
            mockAutoraceRaceRepositoryFromStorageImpl();
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromStorage', {
            useValue: autoraceRaceRepositoryFromStorageImpl,
        });
        autoraceRaceRepositoryFromHtmlImpl =
            mockAutoraceRaceRepositoryFromHtmlImpl();
        container.register<
            IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
        >('AutoraceRaceRepositoryFromHtml', {
            useValue: autoraceRaceRepositoryFromHtmlImpl,
        });

        // autoracePlaceRepositoryFromStorageImplをコンテナに登録
        autoracePlaceRepositoryFromStorageImpl =
            mockAutoracePlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromStorage',
            {
                useValue: autoracePlaceRepositoryFromStorageImpl,
            },
        );

        // AutoraceRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(AutoraceRaceDataUseCase);
    });

    const baseRaceData = baseAutoraceRaceData;
    const baseRaceEntity = baseAutoraceRaceEntity;

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: AutoraceRaceData[] = [baseRaceData];
            const mockRaceEntity: AutoraceRaceEntity[] = [baseRaceEntity];

            // モックの戻り値を設定
            autoraceRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<AutoraceRaceEntity>(mockRaceEntity),
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
            const mockRaceEntity: AutoraceRaceEntity[] = [baseRaceEntity];

            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定
            autoraceRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<AutoraceRaceEntity>(mockRaceEntity),
            );

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(
                autoracePlaceRepositoryFromStorageImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                autoraceRaceRepositoryFromHtmlImpl.fetchRaceList,
            ).toHaveBeenCalled();
            expect(
                autoraceRaceRepositoryFromStorageImpl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2025-12-01');
            const finishDate = new Date('2025-12-31');

            // モックの戻り値を設定（エラーが発生するように設定）
            autoraceRaceRepositoryFromHtmlImpl.fetchRaceList.mockRejectedValue(
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
