import { z } from 'zod';

import {
    type AutoraceGradeType,
    AutoraceRaceCourseSchema,
    type AutoraceRaceStage,
} from './autorace';
import {
    type BoatraceGradeType,
    BoatraceRaceCourseSchema,
    type BoatraceRaceStage,
} from './boatrace';
import { type JraGradeType, JraRaceCourseSchema } from './jra';
import {
    type KeirinGradeType,
    KeirinRaceCourseSchema,
    type KeirinRaceStage,
} from './keirin';
import { type NarGradeType, NarRaceCourseSchema } from './nar';
import { type WorldGradeType, WorldRaceCourseSchema } from './world';

export type GradeType =
    | JraGradeType
    | NarGradeType
    | WorldGradeType
    | KeirinGradeType
    | AutoraceGradeType
    | BoatraceGradeType;

/**
 * RaceCourseのzod型定義
 */
export const RaceCourseSchema = z.union([
    JraRaceCourseSchema,
    NarRaceCourseSchema,
    WorldRaceCourseSchema,
    KeirinRaceCourseSchema,
    AutoraceRaceCourseSchema,
    BoatraceRaceCourseSchema,
]);

/**
 * RaceCourseの型定義
 */
export type RaceCourse = z.infer<typeof RaceCourseSchema>;

export type RaceStage =
    | KeirinRaceStage
    | AutoraceRaceStage
    | BoatraceRaceStage
    | undefined;
