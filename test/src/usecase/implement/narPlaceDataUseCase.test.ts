import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { NarPlaceDataUseCase } from '../../../../lib/src/usecase/implement/narPlaceDataUseCase';
import { baseNarPlaceEntity } from '../../mock/common/baseNarData';
import { mockNarPlaceRepositoryFromHtmlImpl } from '../../mock/repository/narPlaceRepositoryFromHtmlImpl';
import { mockNarPlaceRepositoryFromStorageImpl } from '../../mock/repository/narPlaceRepositoryFromStorageImpl';

describe('NarPlaceDataUseCase', () => {
    let narPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let narPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let useCase: NarPlaceDataUseCase;

    beforeEach(() => {
        // narPlaceRepositoryFromStorageImplをコンテナに登録
        narPlaceRepositoryFromStorageImpl =
            mockNarPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromStorage',
            {
                useValue: narPlaceRepositoryFromStorageImpl,
            },
        );

        narPlaceRepositoryFromHtmlImpl = mockNarPlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            {
                useValue: narPlaceRepositoryFromHtmlImpl,
            },
        );

        // NarPlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(NarPlaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];

            // モックの戻り値を設定
            narPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<NarPlaceEntity>(mockPlaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceEntityList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockPlaceEntity);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceEntity: NarPlaceEntity[] = [baseNarPlaceEntity];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            narPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<NarPlaceEntity>(mockPlaceEntity),
            );

            await useCase.updatePlaceEntityList(startDate, finishDate);

            expect(
                narPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList,
            ).toHaveBeenCalled();
            expect(
                narPlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });
    });
});
