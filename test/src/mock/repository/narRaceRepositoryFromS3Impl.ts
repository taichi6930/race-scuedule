import { NarRaceData } from "../../../../lib/src/domain/narRaceData";
import { NarPlaceData } from "../../../../lib/src/domain/narPlaceData";
import { IRaceRepository } from "../../../../lib/src/repository/interface/IRaceRepository"

// NarRaceRepositoryFromS3Implのmockを作成します
export const mockNarRaceRepositoryFromS3Impl = (): jest.Mocked<IRaceRepository<NarRaceData, NarPlaceData>> => {
    return {
        fetchRaceList: jest.fn().mockResolvedValue([] as NarRaceData[]),
        registerRaceList: jest.fn().mockResolvedValue({} as NarRaceData),
    };
}
