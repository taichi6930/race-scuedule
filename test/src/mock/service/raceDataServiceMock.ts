import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';

/**
 * JraRaceDataServiceのモックを作成する
 * @returns
}*/
export const mockJraRaceDataServiceMock = (): jest.Mocked<
    IRaceDataService<JraRaceEntity, JraPlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([] as JraRaceEntity[]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};

/**
 * NarRaceDataServiceのモックを作成する
 * @returns
}*/
export const mockNarRaceDataServiceMock = (): jest.Mocked<
    IRaceDataService<NarRaceEntity, NarPlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([] as NarRaceEntity[]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};

/**
 * WorldRaceDataServiceのモックを作成する
 * @returns
}*/
export const mockWorldRaceDataServiceMock = (): jest.Mocked<
    IRaceDataService<WorldRaceEntity, WorldPlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest
            .fn()
            .mockResolvedValue([] as WorldRaceEntity[]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
