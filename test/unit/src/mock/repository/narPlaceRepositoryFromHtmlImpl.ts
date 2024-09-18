import type { NarPlaceData } from '../../../../../lib/src/domain/narPlaceData';
import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';

// NarPlaceRepositoryFromHtmlImplのmockを作成
export const mockNarPlaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IPlaceRepository<NarPlaceData>
> => {
    return {
        fetchPlaceList: jest.fn().mockResolvedValue([] as NarPlaceData[]),
        registerPlaceList: jest.fn().mockResolvedValue({} as NarPlaceData),
    };
};
