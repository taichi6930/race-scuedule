import type { AutoraceGradeType, AutoraceRaceCourse } from './autorace';
import type { BoatraceGradeType, BoatraceRaceCourse } from './boatrace';
import type { JraGradeType, JraRaceCourse } from './jra';
import type { KeirinGradeType, KeirinRaceCourse } from './keirin';
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
