import type { AutoracePlaceData } from './autoracePlaceData';
import type { AutoraceRaceData } from './autoraceRaceData';
import type { JraPlaceData } from './jraPlaceData';
import type { JraRaceData } from './jraRaceData';
import type { KeirinPlaceData } from './keirinPlaceData';
import type { KeirinRaceData } from './keirinRaceData';
import type { NarPlaceData } from './narPlaceData';
import type { NarRaceData } from './narRaceData';
import type { WorldPlaceData } from './worldPlaceData';
import type { WorldRaceData } from './worldRaceData';

export type RaceData =
    | JraRaceData
    | NarRaceData
    | KeirinRaceData
    | WorldRaceData
    | AutoraceRaceData;

export type PlaceData =
    | JraPlaceData
    | NarPlaceData
    | KeirinPlaceData
    | WorldPlaceData
    | AutoracePlaceData;
