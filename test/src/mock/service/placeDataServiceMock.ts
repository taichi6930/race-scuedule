import type { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import type { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { IPlaceDataService } from '../../../../lib/src/service/interface/IPlaceDataService';

/**
 * JraPlaceDataServiceのモックを作成する
 * @returns
}*/
export const mockJraPlaceDataServiceMock = (): jest.Mocked<
    IPlaceDataService<JraPlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as JraPlaceEntity[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};

/**
 * NarPlaceDataServiceのモックを作成する
 * @returns
}*/
export const mockNarPlaceDataServiceMock = (): jest.Mocked<
    IPlaceDataService<NarPlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as NarPlaceEntity[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};

/**
 * KeirinPlaceDataServiceのモックを作成する
 * @returns
}*/
export const mockKeirinPlaceDataServiceMock = (): jest.Mocked<
    IPlaceDataService<KeirinPlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as KeirinPlaceEntity[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};

/**
 * AutoracePlaceDataServiceのモックを作成する
 * @returns
}*/
export const mockAutoracePlaceDataServiceMock = (): jest.Mocked<
    IPlaceDataService<AutoracePlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as AutoracePlaceEntity[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};

/**
 * BoatracePlaceDataServiceのモックを作成する
 * @returns
}*/
export const mockBoatracePlaceDataServiceMock = (): jest.Mocked<
    IPlaceDataService<BoatracePlaceEntity>
> => {
    return {
        fetchPlaceEntityList: jest
            .fn()
            .mockResolvedValue([] as BoatracePlaceEntity[]),
        updatePlaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
