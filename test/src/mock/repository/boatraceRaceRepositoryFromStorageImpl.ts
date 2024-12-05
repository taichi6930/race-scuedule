import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// BoatraceRaceRepositoryFromStorageImplのmockを作成
export const mockBoatraceRaceRepositoryFromStorageImpl = (): jest.Mocked<
    IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest
            .fn()
            .mockResolvedValue([] as BoatraceRaceEntity[]),
        registerRaceEntityList: jest
            .fn()
            .mockResolvedValue({} as BoatraceRaceEntity),
    };
};
