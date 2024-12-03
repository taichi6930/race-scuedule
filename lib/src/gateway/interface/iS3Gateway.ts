import type { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import type { WorldPlaceEntity } from '../../repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import type { BoatracePlaceRecord } from '../record/boatracePlaceRecord';
import type { BoatraceRacePlayerRecord } from '../record/boatraceRacePlayerRecord';
import type { BoatraceRaceRecord } from '../record/boatraceRaceRecord';
import type { JraPlaceRecord } from '../record/jraPlaceRecord';
import type { JraRaceRecord } from '../record/jraRaceRecord';
import type { KeirinPlaceRecord } from '../record/keirinPlaceRecord';
import type { KeirinRacePlayerRecord } from '../record/keirinRacePlayerRecord';
import type { KeirinRaceRecord } from '../record/keirinRaceRecord';
import type { NarPlaceRecord } from '../record/narPlaceRecord';
import type { NarRaceRecord } from '../record/narRaceRecord';

export type Record =
    | JraPlaceRecord
    | JraRaceRecord
    | NarPlaceRecord
    | NarRaceRecord
    | KeirinPlaceRecord
    | KeirinRaceRecord
    | KeirinRacePlayerRecord
    | BoatracePlaceRecord
    | BoatraceRaceRecord
    | BoatraceRacePlayerRecord
    | DeprecatedEntity;

export type DeprecatedEntity =
    | AutoracePlaceEntity
    | AutoraceRaceEntity
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
