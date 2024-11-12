import type { WorldPlaceData } from '../../domain/worldPlaceData';
import { WorldRaceData } from '../../domain/worldRaceData';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// WorldRaceRepositoryFromS3Implのモックを作成
export class MockWorldRaceRepositoryFromStorageImpl
    implements IRaceRepository<WorldRaceData, WorldPlaceData>
{
    fetchRaceList(
        request: FetchRaceListRequest<WorldPlaceData>,
    ): Promise<FetchRaceListResponse<WorldRaceData>> {
        console.debug(request);
        return Promise.resolve(
            new FetchRaceListResponse([
                new WorldRaceData(
                    '凱旋門賞',
                    new Date('2024-10-02 16:30'),
                    'パリロンシャン',
                    '芝',
                    2400,
                    'GⅠ',
                    11,
                ),
            ]),
        );
    }

    registerRaceList(
        request: RegisterRaceListRequest<WorldRaceData>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        return Promise.resolve(new RegisterRaceListResponse(200));
    }
}
