import type { AutoracePlaceEntity } from './autoracePlaceEntity';
import type { AutoraceRaceEntity } from './autoraceRaceEntity';
import type { BoatracePlaceEntity } from './boatracePlaceEntity';
import type { JraPlaceEntity } from './jraPlaceEntity';
import type { JraRaceEntity } from './jraRaceEntity';
import type { KeirinPlaceEntity } from './keirinPlaceEntity';
import type { KeirinRaceEntity } from './keirinRaceEntity';
import type { NarPlaceEntity } from './narPlaceEntity';
import type { NarRaceEntity } from './narRaceEntity';
import type { WorldPlaceEntity } from './worldPlaceEntity';
import type { WorldRaceEntity } from './worldRaceEntity';

export type RaceEntity =
    | JraRaceEntity
    | NarRaceEntity
    | KeirinRaceEntity
    | WorldRaceEntity
    | AutoraceRaceEntity;

export type PlaceEntity =
    | JraPlaceEntity
    | NarPlaceEntity
    | KeirinPlaceEntity
    | WorldPlaceEntity
    | AutoracePlaceEntity
    | BoatracePlaceEntity;
