import { baseBoatraceRacePlayerDataList } from '../../../../test/src/mock/common/baseBoatraceData';
import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// BoatraceRaceRepositoryFromStorageImplのモックを作成
export class MockBoatraceRaceRepositoryFromStorageImpl
    implements IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
{
    fetchRaceList(
        request: FetchRaceListRequest<BoatracePlaceEntity>,
    ): Promise<FetchRaceListResponse<BoatraceRaceEntity>> {
        console.log(request);
        return Promise.resolve(
            new FetchRaceListResponse([
                new BoatraceRaceEntity(
                    null,
                    new BoatraceRaceData(
                        'グランプリ',
                        '優勝戦',
                        new Date('2024-09-01'),
                        '平和島',
                        'SG',
                        12,
                    ),
                    baseBoatraceRacePlayerDataList,
                ),
            ]),
        );
    }

    registerRaceList(
        request: RegisterRaceListRequest<BoatraceRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        return Promise.resolve(new RegisterRaceListResponse(200));
    }
}
