import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// BoatraceRaceRepositoryFromHtmlImplのmockを作成
export const mockBoatraceRaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as BoatraceRaceEntity[]),
        registerRaceList: jest.fn().mockResolvedValue({} as BoatraceRaceEntity),
    };
};
