import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// NarRaceRepositoryFromStorageImplのmockを作成
export const mockNarRaceRepositoryFromStorageImpl = (): jest.Mocked<
    IRaceRepository<NarRaceEntity, NarPlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([] as NarRaceEntity[]),
        registerRaceEntityList: jest
            .fn()
            .mockResolvedValue({} as NarRaceEntity),
    };
};
