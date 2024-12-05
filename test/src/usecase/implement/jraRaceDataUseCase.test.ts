import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { JraRaceDataUseCase } from '../../../../lib/src/usecase/implement/jraRaceDataUseCase';
import {
    baseJraRaceDataList,
    baseJraRaceEntity,
    baseJraRaceEntityList,
} from '../../mock/common/baseJraData';
import { mockJraPlaceRepositoryFromStorageImpl } from '../../mock/repository/jraPlaceRepositoryFromStorageImpl';
import { mockJraRaceRepositoryFromHtmlImpl } from '../../mock/repository/jraRaceRepositoryFromHtmlImpl';
import { mockJraRaceRepositoryFromStorageImpl } from '../../mock/repository/jraRaceRepositoryFromStorageImpl';

describe('JraRaceDataUseCase', () => {
    let JraRaceRepositoryFromStorageImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    let jraRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<JraRaceEntity, JraPlaceEntity>
    >;
    let JraPlaceRepositoryFromStorageImpl: jest.Mocked<
        IPlaceRepository<JraPlaceEntity>
    >;
    let useCase: JraRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        JraRaceRepositoryFromStorageImpl =
            mockJraRaceRepositoryFromStorageImpl();
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromStorage',
            {
                useValue: JraRaceRepositoryFromStorageImpl,
            },
        );
        jraRaceRepositoryFromHtmlImpl = mockJraRaceRepositoryFromHtmlImpl();
        container.register<IRaceRepository<JraRaceEntity, JraPlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            {
                useValue: jraRaceRepositoryFromHtmlImpl,
            },
        );

        // JraPlaceRepositoryFromStorageImplをコンテナに登録
        JraPlaceRepositoryFromStorageImpl =
            mockJraPlaceRepositoryFromStorageImpl();
        container.register<IPlaceRepository<JraPlaceEntity>>(
            'JraPlaceRepositoryFromStorage',
            {
                useValue: JraPlaceRepositoryFromStorageImpl,
            },
        );

        // JraRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(JraRaceDataUseCase);
    });

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: JraRaceData[] = baseJraRaceDataList;
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            JraRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });

        it('正常にレースデータが取得できること（gradeを検索条件に入れて）', async () => {
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            JraRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { gradeList: ['GⅠ'] },
            );

            // レース数が2件であることを確認
            expect(result.length).toBe(2);
        });

        it('正常にレースデータが取得できること（locationを検索条件に入れて）', async () => {
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            JraRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { locationList: ['東京'] },
            );

            // レース数が12件であることを確認
            expect(result.length).toBe(12);
        });

        it('正常にレースデータが取得できること（grade, locationを検索条件に入れて）', async () => {
            const mockRaceEntity: JraRaceEntity[] = baseJraRaceEntityList;

            // モックの戻り値を設定
            JraRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceEntity>(mockRaceEntity),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
                { gradeList: ['GⅠ'], locationList: ['東京'] },
            );

            // レース数が1件であることを確認
            expect(result.length).toBe(1);
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceEntity: JraRaceEntity[] = [baseJraRaceEntity];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            JraRaceRepositoryFromStorageImpl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceEntity>(mockRaceEntity),
            );

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(
                JraPlaceRepositoryFromStorageImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                jraRaceRepositoryFromHtmlImpl.fetchRaceList,
            ).toHaveBeenCalled();
            expect(
                JraRaceRepositoryFromStorageImpl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定（エラーが発生するように設定）
            jraRaceRepositoryFromHtmlImpl.fetchRaceList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.updateRaceEntityList(startDate, finishDate);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('upsertRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: JraRaceData[] = baseJraRaceDataList;

            await useCase.upsertRaceDataList(mockRaceData);

            expect(
                JraRaceRepositoryFromStorageImpl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const mockRaceData: JraRaceData[] = baseJraRaceDataList;
            // モックの戻り値を設定（エラーが発生するように設定）
            JraRaceRepositoryFromStorageImpl.registerRaceList.mockRejectedValue(
                new Error('レースデータの登録に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.upsertRaceDataList(mockRaceData);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
