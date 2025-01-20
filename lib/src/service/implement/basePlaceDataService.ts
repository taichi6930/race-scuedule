import { PlaceEntity } from '../../repository/entity/baseEntity';
import { IPlaceRepository } from '../../repository/interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../../repository/request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../../repository/request/registerPlaceListRequest';
import { Logger } from '../../utility/logger';
import { IPlaceDataService } from '../interface/IPlaceDataService';

export abstract class BasePlaceDataService<P extends PlaceEntity>
    implements IPlaceDataService<P>
{
    protected abstract placeRepositoryFromStorage: IPlaceRepository<P>;
    protected abstract placeRepositoryFromHtml: IPlaceRepository<P>;

    @Logger
    async fetchPlaceEntityList(
        startDate: Date,
        finishDate: Date,
        type: 'storage' | 'web',
    ): Promise<P[]> {
        try {
            const request = new FetchPlaceListRequest(startDate, finishDate);
            const repository =
                type === 'storage'
                    ? this.placeRepositoryFromStorage
                    : this.placeRepositoryFromHtml;

            const response = await repository.fetchPlaceEntityList(request);
            return response.placeEntityList;
        } catch (error) {
            console.error('レースデータの取得に失敗しました', error);
            return [];
        }
    }

    @Logger
    async updatePlaceEntityList(placeEntityList: P[]): Promise<void> {
        try {
            if (placeEntityList.length === 0) return;

            const registerRequest = new RegisterPlaceListRequest(
                placeEntityList,
            );
            await this.placeRepositoryFromStorage.registerPlaceEntityList(
                registerRequest,
            );
        } catch (error) {
            console.error('開催場データの更新に失敗しました', error);
        }
    }
}
