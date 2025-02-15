import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { KeirinRaceDataService } from '../../../../lib/src/service/implement/keirinRaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseKeirinRaceEntityList } from '../../mock/common/baseKeirinData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';
import { mockRaceRepository } from '../../mock/repository/mockRaceRepository';

describe('KeirinRaceDataService', () => {
    let raceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let raceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
    >;
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<KeirinPlaceEntity>
    >;
    let service: KeirinRaceDataService;

    beforeEach(() => {
        raceRepositoryFromStorageImpl = mockRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >();
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromStorage', {
            useValue: raceRepositoryFromStorageImpl,
        });
        raceRepositoryFromHtmlImpl = mockRaceRepository<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >();
        container.register<
            IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
        >('KeirinRaceRepositoryFromHtml', {
            useValue: raceRepositoryFromHtmlImpl,
        });

        placeRepositoryFromStorageImpl =
            mockPlaceRepository<KeirinPlaceEntity>();
        container.register<IPlaceRepository<KeirinPlaceEntity>>(
            'KeirinPlaceRepositoryFromStorage',
            {
                useValue: placeRepositoryFromStorageImpl,
            },
        );

        service = container.resolve(KeirinRaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレースデータが取得できること（storage）', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = baseKeirinRaceEntityList;

            // モックの戻り値を設定
            raceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

            expect(result).toEqual(mockRaceEntity);
        });
        it('正常にレースデータが取得できること（web）', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = baseKeirinRaceEntityList;

            // モックの戻り値を設定
            raceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
            );

            expect(result).toEqual(mockRaceEntity);
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            raceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchRaceEntityList(startDate, finishDate, 'storage');

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = baseKeirinRaceEntityList;

            // モックの戻り値を設定
            raceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                raceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レース数が0件の場合、更新処理が実行されないこと', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = [];

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                raceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceEntity: KeirinRaceEntity[] = baseKeirinRaceEntityList;

            // モックの戻り値を設定（エラーが発生するように設定）
            raceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updateRaceEntityList(mockRaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
