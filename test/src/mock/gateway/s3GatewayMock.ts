import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { AutoracePlaceRecord } from '../../../../lib/src/gateway/record/autoracePlaceRecord';
import type { AutoraceRacePlayerRecord } from '../../../../lib/src/gateway/record/autoraceRacePlayerRecord';
import type { AutoraceRaceRecord } from '../../../../lib/src/gateway/record/autoraceRaceRecord';
import type { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import type { BoatraceRacePlayerRecord } from '../../../../lib/src/gateway/record/boatraceRacePlayerRecord';
import type { BoatraceRaceRecord } from '../../../../lib/src/gateway/record/boatraceRaceRecord';
import type { JraPlaceRecord } from '../../../../lib/src/gateway/record/jraPlaceRecord';
import type { JraRaceRecord } from '../../../../lib/src/gateway/record/jraRaceRecord';
import type { KeirinPlaceRecord } from '../../../../lib/src/gateway/record/keirinPlaceRecord';
import type { KeirinRacePlayerRecord } from '../../../../lib/src/gateway/record/keirinRacePlayerRecord';
import type { KeirinRaceRecord } from '../../../../lib/src/gateway/record/keirinRaceRecord';
import type { NarPlaceRecord } from '../../../../lib/src/gateway/record/narPlaceRecord';
import type { NarRaceRecord } from '../../../../lib/src/gateway/record/narRaceRecord';
import type { WorldRaceRecord } from '../../../../lib/src/gateway/record/worldRaceRecord';

export const mockS3GatewayForNarRace = (): jest.Mocked<
    IS3Gateway<NarRaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForNarPlace = (): jest.Mocked<
    IS3Gateway<NarPlaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForJraRace = (): jest.Mocked<
    IS3Gateway<JraRaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForJraPlace = (): jest.Mocked<
    IS3Gateway<JraPlaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForKeirinRace = (): jest.Mocked<
    IS3Gateway<KeirinRaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForKeirinRacePlayer = (): jest.Mocked<
    IS3Gateway<KeirinRacePlayerRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForKeirinPlace = (): jest.Mocked<
    IS3Gateway<KeirinPlaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForWorldRace = (): jest.Mocked<
    IS3Gateway<WorldRaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForAutoraceRace = (): jest.Mocked<
    IS3Gateway<AutoraceRaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForAutoracePlace = (): jest.Mocked<
    IS3Gateway<AutoracePlaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForAutoraceRacePlayer = (): jest.Mocked<
    IS3Gateway<AutoraceRacePlayerRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForBoatraceRace = (): jest.Mocked<
    IS3Gateway<BoatraceRaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForBoatraceRacePlayer = (): jest.Mocked<
    IS3Gateway<BoatraceRacePlayerRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};

export const mockS3GatewayForBoatracePlace = (): jest.Mocked<
    IS3Gateway<BoatracePlaceRecord>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};
