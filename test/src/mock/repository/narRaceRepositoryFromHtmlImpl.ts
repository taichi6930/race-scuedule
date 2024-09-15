import type { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// NarRaceRepositoryFromHtmlImplのmockを作成
export const mockNarRaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IRaceRepository<NarRaceData, NarPlaceData>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as NarRaceData[]),
        registerRaceList: jest.fn().mockResolvedValue({} as NarRaceData),
    };
};
