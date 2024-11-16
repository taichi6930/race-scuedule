import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// KeirinPlaceRepositoryFromHtmlImplのmockを作成
export const mockKeirinPlaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IPlaceRepository<KeirinPlaceEntity>
> => {
    return {
        fetchPlaceList: jest.fn().mockResolvedValue([] as KeirinPlaceEntity[]),
        registerPlaceList: jest.fn().mockResolvedValue({} as KeirinPlaceEntity),
    };
};
