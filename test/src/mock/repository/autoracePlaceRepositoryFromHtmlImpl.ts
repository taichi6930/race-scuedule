import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// AutoracePlaceRepositoryFromHtmlImplのmockを作成
export const mockAutoracePlaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IPlaceRepository<AutoracePlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as AutoracePlaceEntity[]),
        registerPlaceEntityList: jest
            .fn()
            .mockResolvedValue({} as AutoracePlaceEntity),
    };
};
