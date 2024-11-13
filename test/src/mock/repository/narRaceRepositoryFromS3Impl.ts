import type { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// NarRaceRepositoryFromS3Implのmockを作成
export const mockNarRaceRepositoryFromS3Impl = (): jest.Mocked<
    IRaceRepository<NarRaceEntity, NarPlaceEntity>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as NarRaceData[]),
        registerRaceList: jest.fn().mockResolvedValue({} as NarRaceData),
    };
};
