import type { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import type { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import type { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import type { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import type { BoatracePlaceRecord } from '../record/boatracePlaceRecord';
import type { KeirinPlaceRecord } from '../record/keirinPlaceRecord';
import type { KeirinRaceRecord } from '../record/keirinRaceRecord';

export type Record =
    | KeirinPlaceRecord
    | KeirinRaceRecord
    | BoatracePlaceRecord
    | DeprecatedEntity;

export type DeprecatedEntity =
    | AutoracePlaceEntity
    | AutoraceRaceEntity
    | JraPlaceEntity
    | JraRaceEntity
    | NarPlaceEntity
    | NarRaceEntity
    | WorldPlaceEntity
    | WorldRaceEntity;

/**
 * Interface for S3Gateway
 */
export interface IS3Gateway<T extends Record> {
    /**
     * S3にデータをアップロードする
     * @param data
     * @param fileName
     */
    uploadDataToS3: (data: T[], fileName: string) => Promise<void>;
    /**
     * S3からデータを取得する
     * @param fileName
     */
    fetchDataFromS3: (fileName: string) => Promise<string>;
}
