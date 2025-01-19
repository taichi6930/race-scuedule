import { inject, injectable } from 'tsyringe';

import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

@injectable()
export class KeirinPlaceDataUseCase
    implements IPlaceDataUseCase<KeirinPlaceData>
{
    constructor(
        @inject('KeirinPlaceDataService')
        private readonly keirinPlaceDataService: IPlaceDataService<KeirinPlaceEntity>,
    ) {}
    /**
     * レース開催データを取得する
     *
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<KeirinPlaceData[]> {
        const placeEntityList: KeirinPlaceEntity[] =
            await this.keirinPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );
        // placeEntityListをplaceDataListに変換する
        const placeDataList: KeirinPlaceData[] = placeEntityList.map(
            (placeEntity) => placeEntity.placeData,
        );
        return placeDataList;
    }

    /**
     * レース開催データを更新する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    async updatePlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<void> {
        // startDateは月の1日に設定する
        const modifyStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            1,
        );
        // finishDateは月の最終日に設定する
        const modifyFinishDate = new Date(
            finishDate.getFullYear(),
            finishDate.getMonth() + 1,
            0,
        );
        // HTMLからデータを取得する
        const placeEntityList: KeirinPlaceEntity[] =
            await this.keirinPlaceDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                'web',
            );
        // S3にデータを保存する
        await this.keirinPlaceDataService.updatePlaceEntityList(
            placeEntityList,
        );
    }
}
