import type { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// KeirinRaceRepositoryFromS3Implのmockを作成
export const mockKeirinRaceRepositoryFromS3Impl = (): jest.Mocked<
    IRaceRepository<KeirinRaceData, KeirinPlaceData>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as KeirinRaceData[]),
        registerRaceList: jest.fn().mockResolvedValue({} as KeirinRaceData),
    };
};
