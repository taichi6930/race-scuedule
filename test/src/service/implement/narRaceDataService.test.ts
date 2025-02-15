import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { NarRaceDataService } from '../../../../lib/src/service/implement/narRaceDataService';
import { DataLocation } from '../../../../lib/src/utility/dataType';
import { baseNarRaceEntityList } from '../../mock/common/baseNarData';
import { mockPlaceRepository } from '../../mock/repository/mockPlaceRepository';
import { mockRaceRepository } from '../../mock/repository/mockRaceRepository';

describe('NarRaceDataService', () => {
    let raceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<NarRaceEntity, NarPlaceEntity>
    >;
    let raceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<NarRaceEntity, NarPlaceEntity>
    >;
    let placeRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<NarPlaceEntity>
    >;
    let service: NarRaceDataService;

    beforeEach(() => {
        raceRepositoryFromStorageImpl = mockRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >();
        container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceRepositoryFromStorage',
            {
                useValue: raceRepositoryFromStorageImpl,
            },
        );
        raceRepositoryFromHtmlImpl = mockRaceRepository<
            NarRaceEntity,
            NarPlaceEntity
        >();
        container.register<IRaceRepository<NarRaceEntity, NarPlaceEntity>>(
            'NarRaceRepositoryFromHtml',
            {
                useValue: raceRepositoryFromHtmlImpl,
            },
        );

        placeRepositoryFromStorageImpl = mockPlaceRepository<NarPlaceEntity>();
        container.register<IPlaceRepository<NarPlaceEntity>>(
            'NarPlaceRepositoryFromStorage',
            {
                useValue: placeRepositoryFromStorageImpl,
            },
        );

        service = container.resolve(NarRaceDataService);
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレースデータが取得できること（storage）', async () => {
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

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
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

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
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

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
            const mockRaceEntity: NarRaceEntity[] = [];

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                raceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceEntity: NarRaceEntity[] = baseNarRaceEntityList;

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
