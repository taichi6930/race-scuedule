import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// NarRaceRepositoryFromHtmlImplのmockを作成
export const mockNarRaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IRaceRepository<NarRaceEntity, NarPlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([] as NarRaceEntity[]),
        registerRaceEntityList: jest
            .fn()
            .mockResolvedValue({} as NarRaceEntity),
    };
};
