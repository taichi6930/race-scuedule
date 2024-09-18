import type { JraPlaceData } from '../../../../../lib/src/domain/jraPlaceData';
import type { JraRaceData } from '../../../../../lib/src/domain/jraRaceData';
import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';

// JraRaceRepositoryFromHtmlImplのmockを作成
export const mockJraRaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IRaceRepository<JraRaceData, JraPlaceData>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as JraRaceData[]),
        registerRaceList: jest.fn().mockResolvedValue({} as JraRaceData),
    };
};
