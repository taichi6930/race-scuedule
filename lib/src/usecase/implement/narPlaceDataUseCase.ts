import { inject, injectable } from 'tsyringe';

import { NarPlaceData } from '../../domain/narPlaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

@injectable()
export class NarPlaceDataUseCase implements IPlaceDataUseCase<NarPlaceData> {
    constructor(
        @inject('NarPlaceDataService')
        private readonly narPlaceDataService: IPlaceDataService<NarPlaceEntity>,
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
    ): Promise<NarPlaceData[]> {
        const placeEntityList: NarPlaceEntity[] =
            await this.narPlaceDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

        const placeDataList: NarPlaceData[] = placeEntityList.map(
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
        const placeEntityList: NarPlaceEntity[] =
            await this.narPlaceDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                'web',
            );

        // データを更新する
        await this.narPlaceDataService.updatePlaceEntityList(placeEntityList);
    }
}
