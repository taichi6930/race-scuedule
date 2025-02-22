import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { BoatraceRaceDataService } from '../../../../lib/src/service/implement/boatraceRaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseBoatraceRaceEntityList } from '../../mock/common/baseBoatraceData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';
import { mockRaceRepository } from '../../mock/repository/mockRaceRepository';

describe('BoatraceRaceDataService', () => {
    let raceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let raceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let service: BoatraceRaceDataService;

    beforeEach(() => {
        raceRepositoryFromStorageImpl = mockRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >();
        container.register<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceRepositoryFromStorage', {
            useValue: raceRepositoryFromStorageImpl,
        });
        raceRepositoryFromHtmlImpl = mockRaceRepository<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >();
        container.register<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceRepositoryFromHtml', {
            useValue: raceRepositoryFromHtmlImpl,
        });

        placeRepositoryFromStorageImpl =
            mockPlaceRepository<BoatracePlaceEntity>();
        container.register<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromStorage',
            {
                useValue: placeRepositoryFromStorageImpl,
            },
        );

        service = container.resolve(BoatraceRaceDataService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレース開催データが取得できること（storage）', async () => {
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

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
        it('正常にレース開催データが取得できること（web）', async () => {
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

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

        it('レース開催データが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            raceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
                new Error('レース開催データの取得に失敗しました'),
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
        it('正常にレース開催データが更新されること', async () => {
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

            // モックの戻り値を設定
            raceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                mockRaceEntity,
            );

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                raceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レース開催データが0件の場合、更新処理が実行されないこと', async () => {
            const mockRaceEntity: BoatraceRaceEntity[] = [];

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                raceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('レース開催データが取得できない場合、エラーが発生すること', async () => {
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

            // モックの戻り値を設定（エラーが発生するように設定）
            raceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
                new Error('レース開催データの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updateRaceEntityList(mockRaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
