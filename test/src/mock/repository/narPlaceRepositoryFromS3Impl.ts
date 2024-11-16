import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// NarPlaceRepositoryFromS3Implのmockを作成
export const mockNarPlaceRepositoryFromS3Impl = (): jest.Mocked<
    IPlaceRepository<NarPlaceEntity>
> => {
    return {
        fetchPlaceList: jest.fn().mockResolvedValue([] as NarPlaceEntity[]),
        registerPlaceList: jest.fn().mockResolvedValue({} as NarPlaceEntity),
    };
};
