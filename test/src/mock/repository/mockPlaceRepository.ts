import type { PlaceEntity } from '../../../../lib/src/repository/entity/baseEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

export const mockPlaceRepository = <P extends PlaceEntity>(): jest.Mocked<
    IPlaceRepository<P>
> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue([] as P[]),
        registerPlaceEntityList: jest.fn().mockResolvedValue({} as P),
    };
};
