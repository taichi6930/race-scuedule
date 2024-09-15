import type { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// JraPlaceRepositoryFromHtmlImplのmockを作成
export const mockJraPlaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IPlaceRepository<JraPlaceData>
> => {
    return {
        fetchPlaceList: jest.fn().mockResolvedValue([] as JraPlaceData[]),
        registerPlaceList: jest.fn().mockResolvedValue({} as JraPlaceData),
    };
};
