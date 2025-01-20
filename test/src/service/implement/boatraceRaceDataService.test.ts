import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { BoatraceRaceDataService } from '../../../../lib/src/service/implement/boatraceRaceDataService';
import { baseBoatraceRaceEntityList } from '../../mock/common/baseBoatraceData';
import { mockBoatracePlaceRepositoryFromStorageImpl } from '../../mock/repository/boatracePlaceRepositoryFromStorageImpl';
import { mockBoatraceRaceRepositoryFromHtmlImpl } from '../../mock/repository/boatraceRaceRepositoryFromHtmlImpl';
import { mockBoatraceRaceRepositoryFromStorageImpl } from '../../mock/repository/boatraceRaceRepositoryFromStorageImpl';

describe('BoatraceRaceDataService', () => {
    let boatraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let boatraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
    >;
    let boatracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let service: BoatraceRaceDataService;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        boatraceRaceRepositoryFromStorageImpl =
            mockBoatraceRaceRepositoryFromStorageImpl();
        container.register<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceRepositoryFromStorage', {
            useValue: boatraceRaceRepositoryFromStorageImpl,
        });
        boatraceRaceRepositoryFromHtmlImpl =
            mockBoatraceRaceRepositoryFromHtmlImpl();
        container.register<
            IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
        >('BoatraceRaceRepositoryFromHtml', {
            useValue: boatraceRaceRepositoryFromHtmlImpl,
        });

        // boatracePlaceRepositoryFromStorageImplをコンテナに登録
        boatracePlaceRepositoryFromStorageImpl =
            mockBoatracePlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromStorage',
            {
                useValue: boatracePlaceRepositoryFromStorageImpl,
            },
        );

        // BoatraceRaceCalendarServiceをコンテナから取得
        service = container.resolve(BoatraceRaceDataService);
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレースデータが取得できること（storage）', async () => {
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

            // モックの戻り値を設定
            boatraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<BoatraceRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

            expect(result).toEqual(mockRaceEntity);
        });
        it('正常にレースデータが取得できること（web）', async () => {
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

            // モックの戻り値を設定
            boatraceRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<BoatraceRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchRaceEntityList(
                startDate,
                finishDate,
                'web',
            );

            expect(result).toEqual(mockRaceEntity);
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            boatraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
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
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

            // モックの戻り値を設定
            boatraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<BoatraceRaceEntity>(mockRaceEntity),
            );

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                boatraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レース数が0件の場合、更新処理が実行されないこと', async () => {
            const mockRaceEntity: BoatraceRaceEntity[] = [];

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                boatraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceEntity: BoatraceRaceEntity[] =
                baseBoatraceRaceEntityList;

            // モックの戻り値を設定（エラーが発生するように設定）
            boatraceRaceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
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
