import type { AutoraceRaceData } from './autoraceRaceData';
import type { BoatraceRaceData } from './boatraceRaceData';
import type { JraRaceData } from './jraRaceData';
import type { KeirinRaceData } from './keirinRaceData';
import type { NarRaceData } from './narRaceData';
import type { WorldRaceData } from './worldRaceData';

export type RaceData =
    | JraRaceData
    | NarRaceData
    | KeirinRaceData
    | WorldRaceData
    | AutoraceRaceData
    | BoatraceRaceData;
