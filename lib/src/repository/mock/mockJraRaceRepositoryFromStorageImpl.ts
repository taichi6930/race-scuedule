import { JraRaceData } from '../../domain/jraRaceData';
import type { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// JraRaceRepositoryFromStorageImplのモックを作成
export class MockJraRaceRepositoryFromStorageImpl
    implements IRaceRepository<JraRaceEntity, JraPlaceEntity>
{
    fetchRaceList(
        request: FetchRaceListRequest<JraPlaceEntity>,
    ): Promise<FetchRaceListResponse<JraRaceEntity>> {
        console.debug(request);
        return Promise.resolve(
            new FetchRaceListResponse([
                new JraRaceEntity(
                    null,
                    new JraRaceData(
                        '有馬記念',
                        new Date('2024-12-28 15:45'),
                        '中山',
                        '芝',
                        2500,
                        'GⅠ',
                        11,
                        5,
                        8,
                    ),
                ),
            ]),
        );
    }

    registerRaceList(
        request: RegisterRaceListRequest<JraRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        return Promise.resolve(new RegisterRaceListResponse(200));
    }
}
