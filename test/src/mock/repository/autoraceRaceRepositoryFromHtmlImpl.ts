import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

// AutoraceRaceRepositoryFromHtmlImplのmockを作成
export const mockAutoraceRaceRepositoryFromHtmlImpl = (): jest.Mocked<
    IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as AutoraceRaceEntity[]),
        registerRaceList: jest.fn().mockResolvedValue({} as AutoraceRaceEntity),
    };
};
