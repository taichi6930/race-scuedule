import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';

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