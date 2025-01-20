import { inject, injectable } from 'tsyringe';

import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

@injectable()
export class BoatracePlaceDataUseCase
    implements IPlaceDataUseCase<BoatracePlaceData>
{
    constructor(
        @inject('BoatracePlaceDataService')
        private readonly boatracePlaceDataService: IPlaceDataService<BoatracePlaceEntity>,
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
    ): Promise<BoatracePlaceData[]> {
        const placeEntityList: BoatracePlaceEntity[] =
            await this.boatracePlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );
        // placeEntityListをplaceDataListに変換する
        const placeDataList: BoatracePlaceData[] = placeEntityList.map(
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
        const placeEntityList: BoatracePlaceEntity[] =
            await this.boatracePlaceDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                'web',
            );
        // S3にデータを保存する
        await this.boatracePlaceDataService.updatePlaceEntityList(
            placeEntityList,
        );
    }
}
