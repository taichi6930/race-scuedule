import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * Autorace開催場データユースケース
 */
@injectable()
export class AutoracePlaceDataUseCase
    implements IPlaceDataUseCase<AutoracePlaceData>
{
    constructor(
        @inject('AutoracePlaceDataService')
        private readonly autoracePlaceDataService: IPlaceDataService<AutoracePlaceEntity>,
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
    ): Promise<AutoracePlaceData[]> {
        const placeEntityList: AutoracePlaceEntity[] =
            await this.autoracePlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );
        const placeDataList: AutoracePlaceData[] = placeEntityList.map(
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
        const placeEntityList: AutoracePlaceEntity[] =
            await this.autoracePlaceDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                DataLocation.Web,
            );
        await this.autoracePlaceDataService.updatePlaceEntityList(
            placeEntityList,
        );
    }
}
