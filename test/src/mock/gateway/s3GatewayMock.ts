import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import type { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';

export const mockS3Gateway = <RaceData>(): jest.Mocked<
    IS3Gateway<RaceData>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForNarRace = (): jest.Mocked<
    IS3Gateway<NarRaceEntity>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForNarPlace = (): jest.Mocked<
    IS3Gateway<NarPlaceEntity>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForJraRace = (): jest.Mocked<
    IS3Gateway<JraRaceEntity>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForJraPlace = (): jest.Mocked<
    IS3Gateway<JraPlaceEntity>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForKeirinRace = (): jest.Mocked<
    IS3Gateway<KeirinRaceEntity>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForKeirinPlace = (): jest.Mocked<
    IS3Gateway<KeirinPlaceEntity>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};
