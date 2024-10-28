import type { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import type { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// KeirinRaceRepositoryFromHtmlImplのmockを作成
export const mockKeirinRaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IRaceRepository<KeirinRaceData, KeirinPlaceData>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as KeirinRaceData[]),
        registerRaceList: jest.fn().mockResolvedValue({} as KeirinRaceData),
    };
};
