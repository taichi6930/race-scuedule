import { inject, injectable } from 'tsyringe';

import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * Boatrace開催場データユースケース
 */
@injectable()
export class BoatracePlaceDataUseCase
    implements IPlaceDataUseCase<BoatracePlaceData>
{
    constructor(
        @inject('BoatracePlaceDataService')
        private readonly boatracePlaceDataService: IPlaceDataService<BoatracePlaceEntity>,
    ) {}
    /**
     * 開催場データを取得する
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
                DataLocation.Storage,
            );
        const placeDataList: BoatracePlaceData[] = placeEntityList.map(
            (placeEntity) => placeEntity.placeData,
        );
        return placeDataList;
    }

    /**
     * 開催場データを更新する
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
                DataLocation.Web,
            );
        await this.boatracePlaceDataService.updatePlaceEntityList(
            placeEntityList,
        );
    }
}
