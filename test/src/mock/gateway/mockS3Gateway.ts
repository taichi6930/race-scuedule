import type { IS3Gateway } from '../../../../lib/src/gateway/interface/iS3Gateway';
import type { Record } from '../../../../lib/src/gateway/interface/iS3Gateway';

export const mockS3Gateway = <T extends Record>(): jest.Mocked<
    IS3Gateway<T>
> => {
    return {
        uploadDataToS3: jest.fn(),
        fetchDataFromS3: jest.fn(),
    };
};
