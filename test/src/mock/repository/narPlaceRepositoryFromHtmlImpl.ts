import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// NarPlaceRepositoryFromHtmlImplのmockを作成
export const mockNarPlaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IPlaceRepository<NarPlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as NarPlaceEntity[]),
        registerPlaceEntityList: jest
            .fn()
            .mockResolvedValue({} as NarPlaceEntity),
    };
};
