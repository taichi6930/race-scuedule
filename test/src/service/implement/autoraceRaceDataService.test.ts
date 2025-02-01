import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { AutoraceRaceDataService } from '../../../../lib/src/service/implement/autoraceRaceDataService';
import { baseAutoraceRaceEntityList } from '../../mock/common/baseAutoraceData';
import { mockAutoraceRaceRepositoryFromHtmlImpl } from '../../mock/repository/autoraceRaceRepositoryFromHtmlImpl';
import { mockAutoraceRaceRepositoryFromStorageImpl } from '../../mock/repository/autoraceRaceRepositoryFromStorageImpl';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';

describe('AutoraceRaceDataService', () => {
    let autoraceRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let autoraceRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
    >;
    let autoracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<AutoracePlaceEntity>
    >;
    let service: AutoraceRaceDataService;

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
            mockPlaceRepository<AutoracePlaceEntity>();
        container.register<IPlaceRepository<AutoracePlaceEntity>>(
            'AutoracePlaceRepositoryFromStorage',
            {
                useValue: autoracePlaceRepositoryFromStorageImpl,
            },
        );

        // AutoraceRaceCalendarServiceをコンテナから取得
        service = container.resolve(AutoraceRaceDataService);
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレースデータが取得できること（storage）', async () => {
            const mockRaceEntity: AutoraceRaceEntity[] =
                baseAutoraceRaceEntityList;

            // モックの戻り値を設定
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<AutoraceRaceEntity>(mockRaceEntity),
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
            const mockRaceEntity: AutoraceRaceEntity[] =
                baseAutoraceRaceEntityList;

            // モックの戻り値を設定
            autoraceRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<AutoraceRaceEntity>(mockRaceEntity),
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
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
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
            const mockRaceEntity: AutoraceRaceEntity[] =
                baseAutoraceRaceEntityList;

            // モックの戻り値を設定
            autoraceRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<AutoraceRaceEntity>(mockRaceEntity),
            );

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                autoraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レース数が0件の場合、更新処理が実行されないこと', async () => {
            const mockRaceEntity: AutoraceRaceEntity[] = [];

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                autoraceRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceEntity: AutoraceRaceEntity[] =
                baseAutoraceRaceEntityList;

            // モックの戻り値を設定（エラーが発生するように設定）
            autoraceRaceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
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
