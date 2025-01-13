import { z } from 'zod';

import { AutoraceGradeTypeSchema } from './autorace/autoraceGradeType';
import { AutoraceRaceCourseSchema } from './autorace/autoraceRaceCourse';
import { AutoraceRaceStageSchema } from './autorace/autoraceRaceStage';
import {
    BoatraceGradeTypeSchema,
    BoatraceRaceCourseSchema,
    BoatraceRaceStageSchema,
} from './boatrace';
import { JraGradeTypeSchema, JraRaceCourseSchema } from './jra';
import {
    KeirinGradeTypeSchema,
    KeirinRaceCourseSchema,
    KeirinRaceStageSchema,
} from './keirin';
import { NarGradeTypeSchema, NarRaceCourseSchema } from './nar';
import { WorldGradeTypeSchema, WorldRaceCourseSchema } from './world';

/**
 * GradeTypeのzod型定義
 */
export const GradeTypeSchema = z.union([
    JraGradeTypeSchema,
    NarGradeTypeSchema,
    WorldGradeTypeSchema,
    KeirinGradeTypeSchema,
    AutoraceGradeTypeSchema,
    BoatraceGradeTypeSchema,
]);

/**
 * GradeTypeの型定義
 */
export type GradeType = z.infer<typeof GradeTypeSchema>;

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

/**
 * RaceStageのzod型定義
 */
export const RaceStageSchema = z.union([
    KeirinRaceStageSchema,
    AutoraceRaceStageSchema,
    BoatraceRaceStageSchema,
]);

/**
 * RaceStageの型定義
 */
export type RaceStage = z.infer<typeof RaceStageSchema>;
