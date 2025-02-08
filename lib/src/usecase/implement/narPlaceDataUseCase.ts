import { inject, injectable } from 'tsyringe';

import { NarPlaceData } from '../../domain/narPlaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * Narの開催場所情報ユースケース
 */
@injectable()
export class NarPlaceDataUseCase implements IPlaceDataUseCase<NarPlaceData> {
    constructor(
        @inject('NarPlaceDataService')
        private readonly narPlaceDataService: IPlaceDataService<NarPlaceEntity>,
    ) {}
    /**
     * PlaceDataリストを取得する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<NarPlaceData[]> {
        const placeEntityList: NarPlaceEntity[] =
            await this.narPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const placeDataList: NarPlaceData[] = placeEntityList.map(
            (placeEntity) => placeEntity.placeData,
        );
        return placeDataList;
    }

    /**
     * PlaceDataリストを更新する
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
        const placeEntityList: NarPlaceEntity[] =
            await this.narPlaceDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                DataLocation.Web,
            );
        await this.narPlaceDataService.updatePlaceEntityList(placeEntityList);
    }
}
