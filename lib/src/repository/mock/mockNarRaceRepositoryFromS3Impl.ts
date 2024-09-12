import { NarPlaceData } from '../../domain/narPlaceData';
import { NarRaceData } from '../../domain/narRaceData';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// NarRaceRepositoryFromS3Implのモックを作成
export class MockNarRaceRepositoryFromS3Impl
    implements IRaceRepository<NarRaceData, NarPlaceData>
{
    async fetchRaceList(
        request: FetchRaceListRequest<NarPlaceData>,
    ): Promise<FetchRaceListResponse<NarRaceData>> {
        return new FetchRaceListResponse([
            new NarRaceData(
                '東京ダービー',
                new Date('2024-06-01'),
                '大井',
                'ダート',
                2000,
                'GⅠ',
                1,
            ),
        ]);
    }

    async registerRaceList(
        request: RegisterRaceListRequest<NarRaceData>,
    ): Promise<RegisterRaceListResponse> {
        return new RegisterRaceListResponse(200);
    }
}
