import type { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// JraRaceRepositoryFromHtmlImplのmockを作成
export const mockJraRaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IRaceRepository<JraRaceEntity, JraPlaceEntity>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as JraRaceData[]),
        registerRaceList: jest.fn().mockResolvedValue({} as JraRaceData),
    };
};
