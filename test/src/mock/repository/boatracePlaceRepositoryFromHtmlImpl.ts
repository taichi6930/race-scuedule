import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// BoatracePlaceRepositoryFromHtmlImplのmockを作成
export const mockBoatracePlaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IPlaceRepository<BoatracePlaceEntity>
> => {
    return {
        fetchPlaceList: jest
            .fn()
            .mockResolvedValue([] as BoatracePlaceEntity[]),
        registerPlaceList: jest
            .fn()
            .mockResolvedValue({} as BoatracePlaceEntity),
    };
};
