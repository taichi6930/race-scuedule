import { WorldRaceData } from '../../domain/worldRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { WorldPlaceEntity } from '../entity/worldPlaceEntity';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// WorldRaceRepositoryFromHtmlImplのモックを作成
export class MockWorldRaceRepositoryFromHtmlImpl
    implements IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
{
    @Logger
    fetchRaceEntityList(
        request: FetchRaceListRequest<WorldPlaceEntity>,
    ): Promise<WorldRaceEntity[]> {
        const raceEntityList: WorldRaceEntity[] = [];
        const currentDate = new Date(request.startDate);
        while (currentDate.getMonth() === request.startDate.getMonth()) {
            // 1から12までのレースを作成
            for (let i = 1; i <= 12; i++) {
                raceEntityList.push(
                    WorldRaceEntity.createWithoutId(
                        WorldRaceData.create(
                            `第${i.toString()}R`,
                            new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                currentDate.getDate(),
                                i + 9,
                            ),
                            'ロンシャン',
                            '芝',
                            2400,
                            'GⅠ',
                            i,
                        ),
                        getJSTDate(new Date()),
                    ),
                );
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return Promise.resolve(raceEntityList);
    }

    @Logger
    registerRaceEntityList(
        request: RegisterRaceListRequest<WorldRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
