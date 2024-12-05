import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// JraPlaceRepositoryFromHtmlImplのmockを作成
export const mockJraPlaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IPlaceRepository<JraPlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as JraPlaceEntity[]),
        registerPlaceEntityList: jest
            .fn()
            .mockResolvedValue({} as JraPlaceEntity),
    };
};
