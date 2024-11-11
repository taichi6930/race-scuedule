import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// KeirinRaceRepositoryFromHtmlImplのmockを作成
export const mockKeirinRaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as KeirinRaceEntity[]),
        registerRaceList: jest.fn().mockResolvedValue({} as KeirinRaceEntity),
    };
};
