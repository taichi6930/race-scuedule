import type { IPlaceEntity } from '../../../../lib/src/repository/entity/iPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

export const mockPlaceRepository = <P extends IPlaceEntity<P>>(): jest.Mocked<
    IPlaceRepository<P>
> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([] as P[]),
        registerPlaceEntityList: jest.fn().mockResolvedValue({} as P),
    };
};
