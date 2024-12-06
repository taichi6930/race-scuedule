import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// KeirinRaceRepositoryFromStorageImplのmockを作成
export const mockKeirinRaceRepositoryFromStorageImpl = (): jest.Mocked<
    IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest
            .fn()
            .mockResolvedValue([] as KeirinRaceEntity[]),
        registerRaceEntityList: jest
            .fn()
            .mockResolvedValue({} as KeirinRaceEntity),
    };
};
