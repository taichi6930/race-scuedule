import type { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { IPlaceRepository } from '../../../../lib/src/repository/interface/IPlaceRepository';

// KeirinPlaceRepositoryFromS3Implのmockを作成
export const mockKeirinPlaceRepositoryFromStorageImpl = (): jest.Mocked<
    IPlaceRepository<KeirinPlaceData>
> => {
    return {
        fetchPlaceList: jest.fn().mockResolvedValue([] as KeirinPlaceData[]),
        registerPlaceList: jest.fn().mockResolvedValue({} as KeirinPlaceData),
    };
};
