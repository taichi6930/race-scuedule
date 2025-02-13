import { NarRaceData } from '../../domain/narRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// NarRaceRepositoryFromHtmlImplのモックを作成
export class MockNarRaceRepositoryFromHtmlImpl
    implements IRaceRepository<NarRaceEntity, NarPlaceEntity>
{
    @Logger
    fetchRaceEntityList(
        request: FetchRaceListRequest<NarPlaceEntity>,
    ): Promise<NarRaceEntity[]> {
        const placeEntityList = request.placeEntityList;
        const raceEntityList: NarRaceEntity[] = [];
        if (placeEntityList) {
            placeEntityList.forEach((placeEntity) => {
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    raceEntityList.push(
                        NarRaceEntity.createWithoutId(
                            NarRaceData.create(
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
                            getJSTDate(new Date()),
                        ),
                    );
                }
            });
        }
        return Promise.resolve(raceEntityList);
    }

    @Logger
    registerRaceEntityList(
        raceEntityList: NarRaceEntity[],
    ): Promise<RegisterRaceListResponse> {
        console.debug(raceEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
