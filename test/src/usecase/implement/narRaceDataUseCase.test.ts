import 'reflect-metadata'; // reflect-metadataをインポート
import { container } from 'tsyringe';
import { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';
import { mockNarRaceRepositoryFromS3Impl } from '../../mock/repository/narRaceRepositoryFromS3Impl';
import type { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import { mockNarRaceRepositoryFromHtmlImpl } from '../../mock/repository/narRaceRepositoryFromHtmlImpl';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';
import { mockNarPlaceRepositoryFromS3Impl } from '../../mock/repository/narPlaceRepositoryFromS3Impl';
import { NarRaceDataUseCase } from '../../../../lib/src/usecase/implement/narRaceDataUseCase';
import { FetchRaceListResponse } from '../../../../lib/src/repository/response/fetchRaceListResponse';

describe('NarRaceDataUseCase', () => {
    let narRaceRepositoryFromS3Impl: jest.Mocked<
        IRaceRepository<NarRaceData, NarPlaceData>
    >;
    let narRaceRepositoryFromHtmlImpl: jest.Mocked<
        IRaceRepository<NarRaceData, NarPlaceData>
    >;
    let narPlaceRepositoryFromS3Impl: jest.Mocked<
        IPlaceRepository<NarPlaceData>
    >;
    let useCase: NarRaceDataUseCase;

    beforeEach(() => {
        // IRaceRepositoryインターフェースの依存関係を登録
        narRaceRepositoryFromS3Impl = mockNarRaceRepositoryFromS3Impl();
        container.register<IRaceRepository<NarRaceData, NarPlaceData>>(
            'IRaceRepositoryFromS3',
            {
                useValue: narRaceRepositoryFromS3Impl,
            },
        );
        narRaceRepositoryFromHtmlImpl = mockNarRaceRepositoryFromHtmlImpl();
        container.register<IRaceRepository<NarRaceData, NarPlaceData>>(
            'IRaceRepositoryFromHtml',
            {
                useValue: narRaceRepositoryFromHtmlImpl,
            },
        );

        // narPlaceRepositoryFromS3Implをコンテナに登録
        narPlaceRepositoryFromS3Impl = mockNarPlaceRepositoryFromS3Impl();
        container.register<IPlaceRepository<NarPlaceData>>(
            'IPlaceRepositoryFromS3',
            {
                useValue: narPlaceRepositoryFromS3Impl,
            },
        );

        // NarRaceCalendarUseCaseをコンテナから取得
        useCase = container.resolve(NarRaceDataUseCase);
    });

    const baseRaceData = new NarRaceData(
        '東京ダービー',
        new Date('2024-06-03 20:10'),
        '大井',
        'ダート',
        2000,
        'JpnⅠ',
        11,
    );

    describe('fetchRaceDataList', () => {
        it('正常にレースデータが取得できること', async () => {
            const mockRaceData: NarRaceData[] = [baseRaceData];

            // モックの戻り値を設定
            narRaceRepositoryFromS3Impl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<NarRaceData>(mockRaceData),
            );

            const startDate = new Date('2024-06-01');
            const endDate = new Date('2024-06-30');

            const result = await useCase.fetchRaceDataList(startDate, endDate);

            expect(result).toEqual(mockRaceData);
        });
    });

    describe('updateRaceDataList', () => {
        it('正常にレースデータが更新されること', async () => {
            const mockRaceData: NarRaceData[] = [baseRaceData];

            const startDate = new Date('2024-06-01');
            const endDate = new Date('2024-06-30');

            // モックの戻り値を設定
            narRaceRepositoryFromS3Impl.fetchRaceList.mockResolvedValue(
                new FetchRaceListResponse<NarRaceData>(mockRaceData),
            );

            await useCase.updateRaceDataList(startDate, endDate);

            expect(
                narPlaceRepositoryFromS3Impl.fetchPlaceList,
            ).toHaveBeenCalled();
            expect(
                narRaceRepositoryFromHtmlImpl.fetchRaceList,
            ).toHaveBeenCalled();
            expect(
                narRaceRepositoryFromS3Impl.registerRaceList,
            ).toHaveBeenCalled();
        });

        it('レースデータが取得できない場合、エラーが発生すること', async () => {
            const startDate = new Date('2024-06-01');
            const endDate = new Date('2024-06-30');

            // モックの戻り値を設定（エラーが発生するように設定）
            narRaceRepositoryFromHtmlImpl.fetchRaceList.mockRejectedValue(
                new Error('レースデータの取得に失敗しました'),
            );

            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();

            await useCase.updateRaceDataList(startDate, endDate);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
