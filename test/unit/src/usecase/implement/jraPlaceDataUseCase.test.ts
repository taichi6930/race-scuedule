import 'reflect-metadata'; // reflect-metadataをインポート

import { container } from 'tsyringe';

import { JraPlaceData } from '../../../../../lib/src/domain/jraPlaceData';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';
import { FetchPlaceListResponse } from '../../../../../lib/src/repository/response/fetchPlaceListResponse';
import { JraPlaceDataUseCase } from '../../../../../lib/src/usecase/implement/jraPlaceDataUseCase';
import { mockJraPlaceRepositoryFromHtmlImpl } from '../../mock/repository/jraPlaceRepositoryFromHtmlImpl';
import { mockJraPlaceRepositoryFromS3Impl } from '../../mock/repository/jraPlaceRepositoryFromS3Impl';

describe('JraPlaceDataUseCase', () => {
    let jraPlaceRepositoryFromS3Impl: jest.Mocked<
        IPlaceRepository<JraPlaceData>
    >;
    let jraPlaceRepositoryFromHtmlImpl: jest.Mocked<
        IPlaceRepository<JraPlaceData>
    >;
    let useCase: JraPlaceDataUseCase;

    beforeEach(() => {
        // jraPlaceRepositoryFromS3Implをコンテナに登録
        jraPlaceRepositoryFromS3Impl = mockJraPlaceRepositoryFromS3Impl();
        container.register<IPlaceRepository<JraPlaceData>>(
            'JraPlaceRepositoryFromS3',
            {
                useValue: jraPlaceRepositoryFromS3Impl,
            },
        );

        jraPlaceRepositoryFromHtmlImpl = mockJraPlaceRepositoryFromHtmlImpl();
        container.register<IPlaceRepository<JraPlaceData>>(
            'JraPlaceRepositoryFromHtml',
            {
                useValue: jraPlaceRepositoryFromHtmlImpl,
            },
        );

        // JraPlaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(JraPlaceDataUseCase);
    });

    const basePlaceData = new JraPlaceData(
        new Date('2024-06-03 20:10'),
        '札幌',
    );

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockPlaceData: JraPlaceData[] = [basePlaceData];

            // モックの戻り値を設定
            jraPlaceRepositoryFromS3Impl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<JraPlaceData>(mockPlaceData),
            );

            const startDate = new Date('2024-06-01');
            const endDate = new Date('2024-06-30');

            const result = await useCase.fetchPlaceDataList(startDate, endDate);

            expect(result).toEqual(mockPlaceData);
        });
    });

    describe('updatePlaceDataList', () => {
        it('正常に競馬場データが更新されること', async () => {
            const mockPlaceData: JraPlaceData[] = [basePlaceData];

            const startDate = new Date('2024-06-01');
            const endDate = new Date('2024-06-30');

            // モックの戻り値を設定
            jraPlaceRepositoryFromS3Impl.fetchPlaceList.mockResolvedValue(
                new FetchPlaceListResponse<JraPlaceData>(mockPlaceData),
            );

            await useCase.updatePlaceDataList(startDate, endDate);

            expect(
                jraPlaceRepositoryFromHtmlImpl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                jraPlaceRepositoryFromS3Impl.registerPlaceList,
            ).toHaveBeenCalled();
        });
    });
});
