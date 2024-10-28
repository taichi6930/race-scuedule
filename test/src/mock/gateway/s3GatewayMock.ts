import type { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import type { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import type { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import type { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';

export const mockS3GatewayForNarRace = (): jest.Mocked<
    IS3Gateway<NarRaceData>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForNarPlace = (): jest.Mocked<
    IS3Gateway<NarPlaceData>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForJraRace = (): jest.Mocked<
    IS3Gateway<JraRaceData>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForJraPlace = (): jest.Mocked<
    IS3Gateway<JraPlaceData>
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
