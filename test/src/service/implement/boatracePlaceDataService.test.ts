import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { BoatracePlaceDataService } from '../../../../lib/src/service/implement/boatracePlaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseBoatracePlaceEntity } from '../../mock/common/baseBoatraceData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';

describe('BoatracePlaceDataService', () => {
    let boatracePlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let boatracePlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<BoatracePlaceEntity>
    >;
    let service: BoatracePlaceDataService;

    beforeEach(() => {
        // boatracePlaceRepositoryFromStorageImplをコンテナに登録
        boatracePlaceRepositoryFromStorageImpl =
            mockPlaceRepository<BoatracePlaceEntity>();
        container.register<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromStorage',
            {
                useValue: boatracePlaceRepositoryFromStorageImpl,
            },
        );

        boatracePlaceRepositoryFromHtmlImpl = mockPlaceRepository();
        container.register<IPlaceRepository<BoatracePlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            {
                useValue: boatracePlaceRepositoryFromHtmlImpl,
            },
        );

        // BoatracePlaceCalendarServiceをコンテナから取得
        service = container.resolve(BoatracePlaceDataService);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること(storage)', async () => {
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
            ];

            // モックの戻り値を設定
            boatracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<BoatracePlaceEntity>(
                    mockPlaceEntity,
                ),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('正常にレースデータが取得できること（web）', async () => {
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
            ];

            // モックの戻り値を設定
            boatracePlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<BoatracePlaceEntity>(
                    mockPlaceEntity,
                ),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            boatracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
            ];

            // モックの戻り値を設定
            boatracePlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<BoatracePlaceEntity>(
                    mockPlaceEntity,
                ),
            );

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(
                boatracePlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('件数0の場合、エラーが発生すること', async () => {
            const mockPlaceEntity: BoatracePlaceEntity[] = [];

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('競馬場データが取得できない場合、エラーが発生すること', async () => {
            const mockPlaceEntity: BoatracePlaceEntity[] = [
                baseBoatracePlaceEntity,
            ];
            // モックの戻り値を設定（エラーが発生するように設定）
            boatracePlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
                new Error('競馬場データの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
