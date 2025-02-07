import { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import { IRaceEntity } from '../../repository/entity/iRaceEntity';
import type { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { FetchRaceListRequest } from '../../repository/request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../../repository/request/registerRaceListRequest';
import { FetchRaceListResponse } from '../../repository/response/fetchRaceListResponse';
import { DataLocation, type DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import type { IRaceDataService } from '../interface/IRaceDataService';

export abstract class BaseRaceDataService<
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
> implements IRaceDataService<R, P>
{
    protected abstract raceRepositoryFromStorage: IRaceRepository<R, P>;
    protected abstract raceRepositoryFromHtml: IRaceRepository<R, P>;

    /**
     * レース開催のデータを取得する
     * @param startDate
     * @param finishDate
     * @param type
     * @param placeEntityList
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        type: DataLocationType,
        placeEntityList?: P[],
    ): Promise<R[]> {
        try {
            const fetchRaceListRequest = new FetchRaceListRequest<P>(
                startDate,
                finishDate,
                placeEntityList,
            );
            const repository = this.getRaceRepository(type);

            const fetchRaceListResponse: FetchRaceListResponse<R> =
                await repository.fetchRaceEntityList(fetchRaceListRequest);
            return fetchRaceListResponse.raceEntityList;
        } catch (error) {
            console.error('レースデータの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * レース開催地のデータを更新する
     * @param raceEntityList
     * @returns
     */
    @Logger
    async updateRaceEntityList(raceEntityList: R[]): Promise<void> {
        try {
            if (raceEntityList.length === 0) return;
            const registerRequest = new RegisterRaceListRequest<R>(
                raceEntityList,
            );
            await this.raceRepositoryFromStorage.registerRaceEntityList(
                registerRequest,
            );
        } catch (error) {
            console.error('開催場データの更新に失敗しました', error);
        }
    }

    /**
     * リポジトリを取得する
     * @param type
     * @returns
     */
    private getRaceRepository(type: DataLocationType): IRaceRepository<R, P> {
        switch (type) {
            case DataLocation.Storage:
                return this.raceRepositoryFromStorage;
            case DataLocation.Web:
                return this.raceRepositoryFromHtml;
        }
    }
}
