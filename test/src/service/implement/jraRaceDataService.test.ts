import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { JraRaceDataService } from '../../../../lib/src/service/implement/jraRaceDataService';
import { baseJraRaceEntityList } from '../../mock/common/baseJraData';
import { mockJraPlaceRepositoryFromStorageImpl } from '../../mock/repository/jraPlaceRepositoryFromStorageImpl';
import { mockJraRaceRepositoryFromHtmlImpl } from '../../mock/repository/jraRaceRepositoryFromHtmlImpl';
import { mockJraRaceRepositoryFromStorageImpl } from '../../mock/repository/jraRaceRepositoryFromStorageImpl';

describe('JraRaceDataService', () => {
    let jraRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    let jraRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    let jraPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let service: JraRaceDataService;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        jraRaceRepositoryFromStorageImpl =
            mockJraRaceRepositoryFromStorageImpl();
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromStorage',
            {
                useValue: jraRaceRepositoryFromStorageImpl,
            },
        );
        jraRaceRepositoryFromHtmlImpl = mockJraRaceRepositoryFromHtmlImpl();
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            {
                useValue: jraRaceRepositoryFromHtmlImpl,
            },
        );

        // jraPlaceRepositoryFromStorageImplをコンテナに登録
        jraPlaceRepositoryFromStorageImpl =
            mockJraPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromStorage',
            {
                useValue: jraPlaceRepositoryFromStorageImpl,
            },
        );

        // JraRaceCalendarServiceをコンテナから取得
        service = container.resolve(JraRaceDataService);
    });

    describe('fetchRaceEntityList', () => {
        it('正常にレースデータが取得できること（storage）', async () => {
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            jraRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceEntity>(mockRaceEntity),
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
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            jraRaceRepositoryFromHtmlImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceEntity>(mockRaceEntity),
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
            jraRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockRejectedValue(
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
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            jraRaceRepositoryFromStorageImpl.fetchRaceEntityList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceEntity>(mockRaceEntity),
            );

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                jraRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).toHaveBeenCalled();
        });

        it('レース数が0件の場合、更新処理が実行されないこと', async () => {
            const mockRaceEntity: JraRaceEntity[] = [];

            await service.updateRaceEntityList(mockRaceEntity);

            expect(
                jraRaceRepositoryFromStorageImpl.registerRaceEntityList,
            ).not.toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定（エラーが発生するように設定）
            jraRaceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updateRaceEntityList(mockRaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
    //     it('正常にレースデータが更新されること', async () => {
    //         const mockRaceData: JraRaceData[] = baseJraRaceDataList;

    //         await service.upsertRaceDataList(mockRaceData);

    //         expect(
    //             jraRaceRepositoryFromStorageImpl.registerRaceEntityList,
    //         ).toHaveBeenCalled();
    //     });

    //     it('レースデータが取得できない場合、エラーが発生すること', async () => {
    //         const mockRaceData: JraRaceData[] = baseJraRaceDataList;
    //         // モックの戻り値を設定（エラーが発生するように設定）
    //         jraRaceRepositoryFromStorageImpl.registerRaceEntityList.mockRejectedValue(
    //             new Error('レースデータの登録に失敗しました'),
    //         );

    //         const consoleSpy = jest
    //             .spyOn(console, 'error')
    //             .mockImplementation();

    //         await service.upsertRaceDataList(mockRaceData);

    //         expect(consoleSpy).toHaveBeenCalled();
    //     });
    // });
});
