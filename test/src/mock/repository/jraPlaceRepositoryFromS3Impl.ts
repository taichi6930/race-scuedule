import type { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// JraPlaceRepositoryFromS3Implのmockを作成
export const mockJraPlaceRepositoryFromS3Impl = (): jest.Mocked<
    IPlaceRepository<JraPlaceEntity>
> => {
    return {
        fetchPlaceList: jest.fn().mockResolvedValue([] as JraPlaceData[]),
        registerPlaceList: jest.fn().mockResolvedValue({} as JraPlaceData),
    };
};
