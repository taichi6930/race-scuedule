import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * Jraの開催場所情報ユースケース
 */
@injectable()
export class JraPlaceDataUseCase implements IPlaceDataUseCase<JraPlaceData> {
    constructor(
        @inject('JraPlaceDataService')
        private readonly jraPlaceDataService: IPlaceDataService<JraPlaceEntity>,
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
    ): Promise<JraPlaceData[]> {
        const placeEntityList: JraPlaceEntity[] =
            await this.jraPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const placeDataList: JraPlaceData[] = placeEntityList.map(
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
        // startDateは年の1日に設定する
        const modifyStartDate = new Date(startDate.getFullYear(), 0, 1);
        // finishDateは年の最終日に設定する
        const modifyFinishDate = new Date(finishDate.getFullYear() + 1, 0, 0);
        const placeEntityList: JraPlaceEntity[] =
            await this.jraPlaceDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                DataLocation.Web,
            );
        await this.jraPlaceDataService.updatePlaceEntityList(placeEntityList);
    }
}
