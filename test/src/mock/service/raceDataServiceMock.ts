import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';

/**
 * JraRaceDataServiceのモックを作成する
 * @returns
}*/
export const mockJraRaceDataServiceMock = (): jest.Mocked<
    IRaceDataService<JraRaceEntity, JraPlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([] as JraRaceEntity[]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
