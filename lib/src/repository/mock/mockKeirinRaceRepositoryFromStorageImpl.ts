import { baseKeirinRacePlayerDataList } from '../../../../test/src/mock/common/baseData';
import { KeirinRaceData } from '../../domain/keirinRaceData';
import type { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// KeirinRaceRepositoryFromStorageImplのモックを作成
export class MockKeirinRaceRepositoryFromStorageImpl
    implements IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
{
    fetchRaceList(
        request: FetchRaceListRequest<KeirinPlaceEntity>,
    ): Promise<FetchRaceListResponse<KeirinRaceEntity>> {
        console.log(request);
        return Promise.resolve(
            new FetchRaceListResponse([
                new KeirinRaceEntity(
                    null,
                    new KeirinRaceData(
                        '競輪祭',
                        'S級決勝',
                        new Date('2024-09-01'),
                        '川崎',
                        'GⅠ',
                        12,
                    ),
                    baseKeirinRacePlayerDataList,
                ),
            ]),
        );
    }

    registerRaceList(
        request: RegisterRaceListRequest<KeirinRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        return Promise.resolve(new RegisterRaceListResponse(200));
    }
}
