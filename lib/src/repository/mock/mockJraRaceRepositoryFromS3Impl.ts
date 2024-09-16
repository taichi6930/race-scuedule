import type { JraPlaceData } from '../../domain/jraPlaceData';
import { JraRaceData } from '../../domain/jraRaceData';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// JraRaceRepositoryFromS3Implのモックを作成
export class MockJraRaceRepositoryFromS3Impl
    implements IRaceRepository<JraRaceData, JraPlaceData>
{
    fetchRaceList(
        request: FetchRaceListRequest<JraPlaceData>,
    ): Promise<FetchRaceListResponse<JraRaceData>> {
        console.debug(request);
        return Promise.resolve(
            new FetchRaceListResponse([
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
            ]),
        );
    }

    registerRaceList(
        request: RegisterRaceListRequest<JraRaceData>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        return Promise.resolve(new RegisterRaceListResponse(200));
    }
}
