import type {
    PlaceEntity,
    RaceEntity,
} from '../../../../lib/src/repository/entity/baseEntity';
import type { IRaceRepository } from '../../../../lib/src/repository/interface/IRaceRepository';

export const mockRaceRepository = <
    R extends RaceEntity,
    P extends PlaceEntity,
>(): jest.Mocked<IRaceRepository<R, P>> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([] as RaceEntity[]),
        registerRaceEntityList: jest.fn().mockResolvedValue({} as RaceEntity),
    };
};
