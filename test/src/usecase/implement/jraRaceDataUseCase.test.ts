import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import type { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';
import { JraRaceDataUseCase } from '../../../../lib/src/usecase/implement/jraRaceDataUseCase';
import { mockJraPlaceRepositoryFromS3Impl } from '../../mock/repository/jraPlaceRepositoryFromS3Impl';
import { mockJraRaceRepositoryFromHtmlImpl } from '../../mock/repository/jraRaceRepositoryFromHtmlImpl';
import { mockJraRaceRepositoryFromS3Impl } from '../../mock/repository/jraRaceRepositoryFromS3Impl';

describe('JraRaceDataUseCase', () => {
    let jraRaceRepositoryFromS3Impl: jest.Mocked<
        IRaceRepository<JraRaceData, JraPlaceData>
    >;
    let jraRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<JraRaceData, JraPlaceData>
    >;
    let jraPlaceRepositoryFromS3Impl: jest.Mocked<
        IPlaceRepository<JraPlaceData>
    >;
    let useCase: JraRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        jraRaceRepositoryFromS3Impl = mockJraRaceRepositoryFromS3Impl();
        container.register<IRaceRepository<JraRaceData, JraPlaceData>>(
            'JraRaceRepositoryFromS3',
            {
                useValue: jraRaceRepositoryFromS3Impl,
            },
        );
        jraRaceRepositoryFromHtmlImpl = mockJraRaceRepositoryFromHtmlImpl();
        container.register<IRaceRepository<JraRaceData, JraPlaceData>>(
            'JraRaceRepositoryFromHtml',
            {
                useValue: jraRaceRepositoryFromHtmlImpl,
            },
        );

        // jraPlaceRepositoryFromS3Implをコンテナに登録
        jraPlaceRepositoryFromS3Impl = mockJraPlaceRepositoryFromS3Impl();
        container.register<IPlaceRepository<JraPlaceData>>(
            'JraPlaceRepositoryFromS3',
            {
                useValue: jraPlaceRepositoryFromS3Impl,
            },
        );

        // JraRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(JraRaceDataUseCase);
    });

    const baseRaceData = new JraRaceData(
        '東京優駿',
        new Date('2024-06-03 20:10'),
        '東京',
        '芝',
        2000,
        'GⅠ',
        11,
        1,
        2,
    );

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: JraRaceData[] = [baseRaceData];

            // モックの戻り値を設定
            jraRaceRepositoryFromS3Impl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceData>(mockRaceData),
            );

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(
                startDate,
                finishDate,
            );

            expect(result).toEqual(mockRaceData);
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: JraRaceData[] = [baseRaceData];

            const startDate = new Date('2024-06-01');
            const finishDate = new Date('2024-06-30');

            // モックの戻り値を設定
            jraRaceRepositoryFromS3Impl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<JraRaceData>(mockRaceData),
            );

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(
                jraPlaceRepositoryFromS3Impl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                jraRaceRepositoryFromHtmlImpl.fetchRaceList,
            ).toHaveBeenCalled();
            expect(
                jraRaceRepositoryFromS3Impl.registerRaceList,
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

            await useCase.updateRaceDataList(startDate, finishDate);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
