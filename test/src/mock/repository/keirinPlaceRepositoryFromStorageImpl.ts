import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// KeirinPlaceRepositoryFromStorageImplのmockを作成
export const mockKeirinPlaceRepositoryFromStorageImpl = (): jest.Mocked<
    IPlaceRepository<KeirinPlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as KeirinPlaceEntity[]),
        registerPlaceEntityList: jest
            .fn()
            .mockResolvedValue({} as KeirinPlaceEntity),
    };
};
