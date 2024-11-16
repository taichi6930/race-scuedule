import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// JraRaceRepositoryFromHtmlImplのmockを作成
export const mockJraRaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IRaceRepository<JraRaceEntity, JraPlaceEntity>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as JraRaceEntity[]),
        registerRaceList: jest.fn().mockResolvedValue({} as JraRaceEntity),
    };
};
