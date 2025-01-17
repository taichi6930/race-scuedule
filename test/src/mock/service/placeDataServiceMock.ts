import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';

/**
 * JraPlaceDataServiceのモックを作成する
 * @returns
}*/
export const mockJraPlaceDataServiceMock = (): jest.Mocked<
    IPlaceDataService<JraPlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as JraPlaceEntity[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
