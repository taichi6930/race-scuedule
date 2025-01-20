import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
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

/**
 * KeirinRaceDataServiceのモックを作成する
 * @returns
}*/
export const mockKeirinRaceDataServiceMock = (): jest.Mocked<
    IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest
            .fn()
            .mockResolvedValue([] as KeirinRaceEntity[]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};

/**
 * AutoraceRaceDataServiceのモックを作成する
 * @returns
}*/
export const mockAutoraceRaceDataServiceMock = (): jest.Mocked<
    IRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest
            .fn()
            .mockResolvedValue([] as AutoraceRaceEntity[]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};

/**
 * BoatraceRaceDataServiceのモックを作成する
 * @returns
}*/
export const mockBoatraceRaceDataServiceMock = (): jest.Mocked<
    IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>
> => {
    return {
        fetchRaceEntityList: jest
            .fn()
            .mockResolvedValue([] as BoatraceRaceEntity[]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
