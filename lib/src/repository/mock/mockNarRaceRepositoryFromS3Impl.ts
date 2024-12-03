import { NarRaceData } from '../../domain/narRaceData';
import type { NarPlaceEntity } from '../entity/narPlaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// NarRaceRepositoryFromS3Implのモックを作成
export class MockNarRaceRepositoryFromS3Impl
    implements IRaceRepository<NarRaceEntity, NarPlaceEntity>
{
    fetchRaceList(
        request: FetchRaceListRequest<NarPlaceEntity>,
    ): Promise<FetchRaceListResponse<NarRaceEntity>> {
        console.debug(request);
        return Promise.resolve(
            new FetchRaceListResponse([
                new NarRaceEntity(
                    null,
                    new NarRaceData(
                        '東京ダービー',
                        new Date('2024-06-01'),
                        '大井',
                        'ダート',
                        2000,
                        'GⅠ',
                        1,
                    ),
                ),
            ]),
        );
    }

    registerRaceList(
        request: RegisterRaceListRequest<NarRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        return Promise.resolve(new RegisterRaceListResponse(200));
    }
}
