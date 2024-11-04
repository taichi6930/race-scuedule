import { Logger } from '../../utility/logger';
import { WorldPlaceEntity } from '../entity/worldPlaceEntity';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// WorldRaceRepositoryFromHtmlImplのモックを作成
export class MockWorldRaceRepositoryFromHtmlImpl
    implements IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
{
    @Logger
    fetchRaceList(
        request: FetchRaceListRequest<WorldPlaceEntity>,
    ): Promise<FetchRaceListResponse<WorldRaceEntity>> {
        const raceEntityList: WorldRaceEntity[] = [];
        // 1から12までのレースを作成
        for (let i = 1; i <= 12; i++) {
            raceEntityList.push(
                new WorldRaceEntity(
                    null,
                    `第${i.toString()}R`,
                    new Date(
                        request.startDate.getFullYear(),
                        request.startDate.getMonth(),
                        request.startDate.getDate(),
                        i + 9,
                    ),
                    'ロンシャン',
                    '芝',
                    2400,
                    'GⅠ',
                ),
            );
        }
        return Promise.resolve(new FetchRaceListResponse(raceEntityList));
    }

    @Logger
    registerRaceList(
        request: RegisterRaceListRequest<WorldRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
