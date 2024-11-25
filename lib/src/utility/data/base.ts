import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceStage,
} from './autorace';
import type {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from './boatrace';
import type { JraGradeType, JraRaceCourse } from './jra';
import type {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from './keirin';
import type { NarGradeType, NarRaceCourse } from './nar';
import type { WorldGradeType, WorldRaceCourse } from './world';

export type GradeType =
    | JraGradeType
    | NarGradeType
    | WorldGradeType
    | KeirinGradeType
    | AutoraceGradeType
    | BoatraceGradeType;

export type RaceCourse =
    | JraRaceCourse
    | NarRaceCourse
    | WorldRaceCourse
    | KeirinRaceCourse
    | AutoraceRaceCourse
    | BoatraceRaceCourse;

export type RaceStage =
    | KeirinRaceStage
    | AutoraceRaceStage
    | BoatraceRaceStage
    | undefined;
