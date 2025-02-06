import type { AutoraceRaceEntity } from './autoraceRaceEntity';
import type { BoatraceRaceEntity } from './boatraceRaceEntity';
import type { JraRaceEntity } from './jraRaceEntity';
import type { KeirinRaceEntity } from './keirinRaceEntity';
import type { NarRaceEntity } from './narRaceEntity';
import type { WorldRaceEntity } from './worldRaceEntity';

export type RaceEntity =
    | JraRaceEntity
    | NarRaceEntity
    | KeirinRaceEntity
    | WorldRaceEntity
    | AutoraceRaceEntity
    | BoatraceRaceEntity;
