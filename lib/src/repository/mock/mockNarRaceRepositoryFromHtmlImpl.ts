import { NarRaceData } from '../../domain/narRaceData';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// NarRaceRepositoryFromHtmlImplのモックを作成
export class MockNarRaceRepositoryFromHtmlImpl
    implements IRaceRepository<NarRaceEntity, NarPlaceEntity>
{
    @Logger
    fetchRaceEntityList(
        request: FetchRaceListRequest<NarPlaceEntity>,
    ): Promise<FetchRaceListResponse<NarRaceEntity>> {
        const placeEntityList = request.placeEntityList;
        const raceEntityList: NarRaceEntity[] = [];
        if (placeEntityList) {
            placeEntityList.forEach((placeEntity) => {
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    raceEntityList.push(
                        new NarRaceEntity(
                            null,
                            new NarRaceData(
                                `${placeEntity.placeData.location}第${i.toString()}R`,
                                new Date(
                                    placeEntity.placeData.dateTime.getFullYear(),
                                    placeEntity.placeData.dateTime.getMonth(),
                                    placeEntity.placeData.dateTime.getDate(),
                                    i + 9,
                                ),
                                placeEntity.placeData.location,
                                'ダート',
                                2000,
                                'GⅠ',
                                i,
                            ),
                        ),
                    );
                }
            });
        }
        return Promise.resolve(new FetchRaceListResponse(raceEntityList));
    }

    @Logger
    registerRaceEntityList(
        request: RegisterRaceListRequest<NarRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
