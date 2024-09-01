import { NarRaceData } from "../../../src/domain/narRaceData";
import { IS3Gateway } from "../../../src/gateway/interface/iS3Gateway";

export const mockS3GatewayForNarRace = (): jest.Mocked<IS3Gateway<NarRaceData>> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
        getFileLastModified: jest.fn(),
    };
};
