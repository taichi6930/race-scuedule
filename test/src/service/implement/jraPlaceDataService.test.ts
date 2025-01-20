import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../lib/src/repository/response/fetchPlaceListResponse';
import { JraPlaceDataService } from '../../../../lib/src/service/implement/jraPlaceDataService';
import { baseJraPlaceEntity } from '../../mock/common/baseJraData';
import { mockJraPlaceRepositoryFromHtmlImpl } from '../../mock/repository/jraPlaceRepositoryFromHtmlImpl';
import { mockJraPlaceRepositoryFromStorageImpl } from '../../mock/repository/jraPlaceRepositoryFromStorageImpl';

describe('JraPlaceDataService', () => {
    let jraPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let jraPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let service: JraPlaceDataService;

    beforeEach(() => {
        // jraPlaceRepositoryFromStorageImplをコンテナに登録
        jraPlaceRepositoryFromStorageImpl =
            mockJraPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromStorage',
            {
                useValue: jraPlaceRepositoryFromStorageImpl,
            },
        );

        jraPlaceRepositoryFromHtmlImpl = mockJraPlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            {
                useValue: jraPlaceRepositoryFromHtmlImpl,
            },
        );

        // JraPlaceCalendarServiceをコンテナから取得
        service = container.resolve(JraPlaceDataService);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること(storage)', async () => {
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];

            // モックの戻り値を設定
            jraPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<JraPlaceEntity>(mockPlaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('正常にレースデータが取得できること（web）', async () => {
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];

            // モックの戻り値を設定
            jraPlaceRepositoryFromHtmlImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<JraPlaceEntity>(mockPlaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await service.fetchPlaceEntityList(
                startDate,
                finishDate,
                'web',
            );

            expect(result).toEqual(mockPlaceEntity);
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            // モックの戻り値を設定（エラーが発生するように設定）
            jraPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockRejectedValue(
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
                'storage',
            );

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];

            // モックの戻り値を設定
            jraPlaceRepositoryFromStorageImpl.fetchPlaceEntityList.mockResolvedValue(
                new FetchPlaceListResponse<JraPlaceEntity>(mockPlaceEntity),
            );

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(
                jraPlaceRepositoryFromStorageImpl.registerPlaceEntityList,
            ).toHaveBeenCalled();
        });

        it('件数0の場合、エラーが発生すること', async () => {
            const mockPlaceEntity: JraPlaceEntity[] = [];

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await service.updatePlaceEntityList(mockPlaceEntity);

            expect(consoleSpy).toHaveBeenCalled();
        });

        it('競馬場データが取得できない場合、エラーが発生すること', async () => {
            const mockPlaceEntity: JraPlaceEntity[] = [baseJraPlaceEntity];
            // モックの戻り値を設定（エラーが発生するように設定）
            jraPlaceRepositoryFromStorageImpl.registerPlaceEntityList.mockRejectedValue(
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
