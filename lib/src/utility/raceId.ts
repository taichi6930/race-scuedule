import { format } from 'date-fns';
import { z } from 'zod';

import {
    type AutoracePositionNumber,
    AutoracePositionNumberSchema,
} from './data/autorace/autoracePositionNumber';
import {
    AUTORACE_PLACE_CODE,
    type AutoraceRaceCourse,
} from './data/autorace/autoraceRaceCourse';
import type { AutoraceRaceNumber } from './data/autorace/autoraceRaceNumber';
import { AutoraceRaceNumberSchema } from './data/autorace/autoraceRaceNumber';
import type { BoatracePositionNumber } from './data/boatrace/boatracePositionNumber';
import { BoatracePositionNumberSchema } from './data/boatrace/boatracePositionNumber';
import type { BoatraceRaceCourse } from './data/boatrace/boatraceRaceCourse';
import { BOATRACE_PLACE_CODE } from './data/boatrace/boatraceRaceCourse';
import type { BoatraceRaceNumber } from './data/boatrace/boatraceRaceNumber';
import { BoatraceRaceNumberSchema } from './data/boatrace/boatraceRaceNumber';
import type { JraRaceCourse } from './data/jra/jraRaceCourse';
import type { JraRaceNumber } from './data/jra/jraRaceNumber';
import { JraRaceNumberSchema } from './data/jra/jraRaceNumber';
import type { KeirinPositionNumber } from './data/keirin/keirinPositionNumber';
import { KeirinPositionNumberSchema } from './data/keirin/keirinPositionNumber';
import type { KeirinRaceCourse } from './data/keirin/keirinRaceCourse';
import { KEIRIN_PLACE_CODE } from './data/keirin/keirinRaceCourse';
import type { KeirinRaceNumber } from './data/keirin/keirinRaceNumber';
import { KeirinRaceNumberSchema } from './data/keirin/keirinRaceNumber';
import type { NarRaceCourse } from './data/nar/narRaceCourse';
import type { NarRaceNumber } from './data/nar/narRaceNumber';
import { NarRaceNumberSchema } from './data/nar/narRaceNumber';
import { NETKEIBA_BABACODE } from './data/netkeiba';
import type { WorldRaceCourse } from './data/world/worldRaceCourse';
import { WORLD_PLACE_CODE } from './data/world/worldRaceCourse';
import type { WorldRaceDateTime } from './data/world/worldRaceDateTime';
import type { WorldRaceNumber } from './data/world/worldRaceNumber';
import { WorldRaceNumberSchema } from './data/world/worldRaceNumber';

/**
 * 中央競馬のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateJraRaceId = (
    dateTime: Date,
    location: JraRaceCourse,
    number: JraRaceNumber,
): JraRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateJraPlaceId(dateTime, location)}${numberCode}`;
};

/**
 * JraRaceIdのzod型定義
 * jra + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const JraRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('jra');
    }, 'jraから始まる必要があります')
    // jraの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^jra\d{8}\d{2}\d{2}$/.test(value);
    }, 'JraRaceIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-2));
        return JraRaceNumberSchema.safeParse(raceNumber).success;
    }, 'レース番号は1~12の範囲である必要があります');

/**
 * JraRaceIdの型定義
 */
export type JraRaceId = z.infer<typeof JraRaceIdSchema>;

/**
 * JraRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのJraRaceId
 */
export const validateJraRaceId = (value: string): JraRaceId => {
    const result = JraRaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * 中央競馬のplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateJraPlaceId = (
    dateTime: Date,
    location: JraRaceCourse,
): JraRaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = NETKEIBA_BABACODE[location];
    return `jra${dateCode}${locationCode}`;
};

/**
 * JraPlaceIdのzod型定義
 * jra + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const JraPlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('jra');
    }, 'jraから始まる必要があります')
    .refine((value) => {
        return /^jra\d{8}\d{2}$/.test(value);
    }, 'JraPlaceIdの形式ではありません');

/**
 * JraPlaceIdの型定義
 */
export type JraPlaceId = z.infer<typeof JraPlaceIdSchema>;

/**
 * JraPlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのJraPlaceId
 */
export const validateJraPlaceId = (value: string): JraPlaceId => {
    const result = JraPlaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * 地方競馬のraceIdを作成する
 *
 * @private
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @returns 生成されたID
 */
export const generateNarRaceId = (
    dateTime: Date,
    location: NarRaceCourse,
    number: NarRaceNumber,
): NarRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateNarPlaceId(dateTime, location)}${numberCode}`;
};

/**
 * NarRaceIdのzod型定義
 * nar + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const NarRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('nar');
    }, 'narから始まる必要があります')
    // narの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^nar\d{8}\d{2}\d{2}$/.test(value);
    }, 'NarRaceIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-2));
        return NarRaceNumberSchema.safeParse(raceNumber).success;
    }, 'レース番号は1~12の範囲である必要があります');

/**
 * NarRaceIdの型定義
 */
export type NarRaceId = z.infer<typeof NarRaceIdSchema>;

/**
 * NarRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのNarRaceId
 */
export const validateNarRaceId = (value: string): NarRaceId => {
    const result = NarRaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * 地方競馬のplaceIdを作成する
 *
 * @private
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @returns 生成されたID
 */
export const generateNarPlaceId = (
    dateTime: Date,
    location: NarRaceCourse,
): NarPlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = NETKEIBA_BABACODE[location];
    return `nar${dateCode}${locationCode}`;
};

/**
 * NarPlaceIdのzod型定義
 * nar + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const NarPlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('nar');
    }, 'narから始まる必要があります')
    .refine((value) => {
        return /^nar\d{8}\d{2}$/.test(value);
    }, 'NarPlaceIdの形式ではありません');

/**
 * NarPlaceIdの型定義
 */
export type NarPlaceId = z.infer<typeof NarPlaceIdSchema>;

/**
 * NarPlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのNarPlaceId
 */
export const validateNarPlaceId = (value: string): NarPlaceId => {
    const result = NarPlaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * 海外競馬のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateWorldRaceId = (
    dateTime: WorldRaceDateTime,
    location: WorldRaceCourse,
    number: WorldRaceNumber,
): WorldRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateWorldPlaceId(dateTime, location)}${numberCode.toString()}`;
};

/**
 * WorldRaceIdのzod型定義
 * world + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const WorldRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('world');
    }, 'worldから始まる必要があります')
    // worldの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^world\d{8}\d{2}\d{2}$/.test(value);
    }, 'WorldRaceIdの形式ではありません')
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-2));
        return WorldRaceNumberSchema.safeParse(raceNumber).success;
    });

/**
 * WorldRaceIdの型定義
 */
export type WorldRaceId = z.infer<typeof WorldRaceIdSchema>;

/**
 * WorldRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのWorldRaceId
 */
export const validateWorldRaceId = (value: string): WorldRaceId => {
    const result = WorldRaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * 海外競馬のplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateWorldPlaceId = (
    dateTime: Date,
    location: WorldRaceCourse,
): WorldRaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = WORLD_PLACE_CODE[location];
    return `world${dateCode}${locationCode}`;
};

/**
 * WorldPlaceIdのzod型定義
 * world + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const WorldPlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('world');
    }, 'worldから始まる必要があります')
    .refine((value) => {
        return /^world\d{8}\d{2}$/.test(value);
    }, 'WorldPlaceIdの形式ではありません');

/**
 * WorldPlaceIdの型定義
 */
export type WorldPlaceId = z.infer<typeof WorldPlaceIdSchema>;

/**
 * WorldPlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのWorldPlaceId
 */
export const validateWorldPlaceId = (value: string): WorldPlaceId => {
    const result = WorldPlaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * 競輪のracePlayerIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param positionNumber - 枠番
 */
export const generateKeirinRacePlayerId = (
    dateTime: Date,
    location: KeirinRaceCourse,
    number: KeirinRaceNumber,
    positionNumber: KeirinPositionNumber,
): KeirinRacePlayerId => {
    const positionNumberCode = positionNumber.toXDigits(2);
    return `${generateKeirinRaceId(dateTime, location, number)}${positionNumberCode}`;
};

/**
 * KeirinRacePlayerIdのzod型定義
 * keirin + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
 */
const KeirinRacePlayerIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('keirin');
    }, 'keirinから始まる必要があります')
    // keirinの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
    .refine((value) => {
        return /^keirin\d{8}\d{2}\d{2}\d{2}$/.test(value);
    }, 'KeirinRacePlayerIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-4, -2));
        return KeirinRaceNumberSchema.safeParse(raceNumber).success;
    }, 'レース番号は1~12の範囲である必要があります')
    // 枠番は1~9の範囲
    .refine((value) => {
        const positionNumber = parseInt(value.slice(-2));
        return KeirinPositionNumberSchema.safeParse(positionNumber).success;
    }, '枠番は1~9の範囲である必要があります');

/**
 * KeirinRacePlayerIdの型定義
 */
export type KeirinRacePlayerId = z.infer<typeof KeirinRacePlayerIdSchema>;

/**
 * KeirinRacePlayerIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのKeirinRacePlayerId
 */
export const validateKeirinRacePlayerId = (
    value: string,
): KeirinRacePlayerId => {
    const result = KeirinRacePlayerIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * 競輪のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateKeirinRaceId = (
    dateTime: Date,
    location: KeirinRaceCourse,
    number: KeirinRaceNumber,
): KeirinRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateKeirinPlaceId(dateTime, location)}${numberCode}`;
};

/**
 * KeirinRaceIdのzod型定義
 * keirin + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const KeirinRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('keirin');
    }, 'keirinから始まる必要があります')
    // keirinの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^keirin\d{8}\d{2}\d{2}$/.test(value);
    }, 'KeirinRaceIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-2));
        return KeirinRaceNumberSchema.safeParse(raceNumber).success;
    }, 'レース番号は1~12の範囲である必要があります');

/**
 * KeirinRaceIdの型定義
 */
export type KeirinRaceId = z.infer<typeof KeirinRaceIdSchema>;

/**
 * KeirinRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのKeirinRaceId
 */
export const validateKeirinRaceId = (value: string): KeirinRaceId => {
    const result = KeirinRaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * 競輪のplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateKeirinPlaceId = (
    dateTime: Date,
    location: KeirinRaceCourse,
): KeirinPlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = KEIRIN_PLACE_CODE[location];
    return `keirin${dateCode}${locationCode}`;
};

/**
 * KeirinPlaceIdのzod型定義
 * keirin + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const KeirinPlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('keirin');
    }, 'keirinから始まる必要があります')
    .refine((value) => {
        return /^keirin\d{8}\d{2}$/.test(value);
    }, 'KeirinPlaceIdの形式ではありません');

/**
 * KeirinPlaceIdの型定義
 */
export type KeirinPlaceId = z.infer<typeof KeirinPlaceIdSchema>;

/**
 * KeirinPlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのKeirinPlaceId
 */
export const validateKeirinPlaceId = (value: string): KeirinPlaceId => {
    const result = KeirinPlaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * ボートレースのracePlayerIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param positionNumber - 枠番
 */
export const generateBoatraceRacePlayerId = (
    dateTime: Date,
    location: BoatraceRaceCourse,
    number: BoatraceRaceNumber,
    positionNumber: BoatracePositionNumber,
): BoatraceRacePlayerId => {
    const positionNumberCode = positionNumber.toXDigits(2);
    return `${generateBoatraceRaceId(dateTime, location, number)}${positionNumberCode}`;
};

/**
 * BoatraceRacePlayerIdのzod型定義
 * boatrace + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
 */
const BoatraceRacePlayerIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('boatrace');
    }, 'boatraceから始まる必要があります')
    // boatraceの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
    .refine((value) => {
        return /^boatrace\d{8}\d{2}\d{2}\d{2}$/.test(value);
    }, 'BoatraceRacePlayerIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-4, -2));
        return BoatraceRaceNumberSchema.safeParse(raceNumber).success;
    }, 'レース番号は1~12の範囲である必要があります')
    // 枠番は1~6の範囲
    .refine((value) => {
        const positionNumber = parseInt(value.slice(-2));
        return BoatracePositionNumberSchema.safeParse(positionNumber).success;
    }, '枠番は1~6の範囲である必要があります');

/**
 * BoatraceRacePlayerIdの型定義
 */
export type BoatraceRacePlayerId = z.infer<typeof BoatraceRacePlayerIdSchema>;

/**
 * BoatraceRacePlayerIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのBoatraceRacePlayerId
 */
export const validateBoatraceRacePlayerId = (
    value: string,
): BoatraceRacePlayerId => {
    const result = BoatraceRacePlayerIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * ボートレースのraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateBoatraceRaceId = (
    dateTime: Date,
    location: BoatraceRaceCourse,
    number: BoatraceRaceNumber,
): BoatraceRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateBoatracePlaceId(dateTime, location)}${numberCode}`;
};

/**
 * BoatraceRaceIdのzod型定義
 * boatrace + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const BoatraceRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('boatrace');
    }, 'boatraceから始まる必要があります')
    // boatraceの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^boatrace\d{8}\d{2}\d{2}$/.test(value);
    }, 'BoatraceRaceIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-2));
        return BoatraceRaceNumberSchema.safeParse(raceNumber).success;
    }, 'レース番号は1~12の範囲である必要があります');

/**
 * BoatraceRaceIdの型定義
 */
export type BoatraceRaceId = z.infer<typeof BoatraceRaceIdSchema>;

/**
 * BoatraceRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのBoatraceRaceId
 */
export const validateBoatraceRaceId = (value: string): BoatraceRaceId => {
    const result = BoatraceRaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
/**
 * ボートレースのplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateBoatracePlaceId = (
    dateTime: Date,
    location: BoatraceRaceCourse,
): BoatracePlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = BOATRACE_PLACE_CODE[location];
    return `boatrace${dateCode}${locationCode}`;
};

/**
 * BoatracePlaceIdのzod型定義
 * boatrace + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const BoatracePlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('boatrace');
    }, 'boatraceから始まる必要があります')
    .refine((value) => {
        return /^boatrace\d{8}\d{2}$/.test(value);
    }, 'BoatracePlaceIdの形式ではありません');

/**
 * BoatracePlaceIdの型定義
 */
export type BoatracePlaceId = z.infer<typeof BoatracePlaceIdSchema>;

/**
 * BoatracePlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのBoatracePlaceId
 */
export const validateBoatracePlaceId = (value: string): BoatracePlaceId => {
    const result = BoatracePlaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * オートレースのracePlayerIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param positionNumber - 枠番
 */
export const generateAutoraceRacePlayerId = (
    dateTime: Date,
    location: AutoraceRaceCourse,
    number: AutoraceRaceNumber,
    positionNumber: AutoracePositionNumber,
): AutoraceRacePlayerId => {
    const positionNumberCode = positionNumber.toXDigits(2);
    return `${generateAutoraceRaceId(dateTime, location, number)}${positionNumberCode}`;
};

/**
 * AutoraceRacePlayerIdのzod型定義
 * autorace + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
 */
const AutoraceRacePlayerIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('autorace');
    }, 'autoraceから始まる必要があります')
    // autoraceの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）+ 2桁の数字（枠番）
    .refine((value) => {
        return /^autorace\d{8}\d{2}\d{2}\d{2}$/.test(value);
    }, 'AutoraceRacePlayerIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-4, -2));
        return AutoraceRaceNumberSchema.safeParse(raceNumber).success;
    }, 'レース番号は1~12の範囲である必要があります')
    // 枠番は1~8の範囲
    .refine((value) => {
        const positionNumber = parseInt(value.slice(-2));
        return AutoracePositionNumberSchema.safeParse(positionNumber).success;
    }, '枠番は1~8の範囲である必要があります');

/**
 * AutoraceRacePlayerIdの型定義
 */
export type AutoraceRacePlayerId = z.infer<typeof AutoraceRacePlayerIdSchema>;

/**
 * AutoraceRacePlayerIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのAutoraceRaceId
 */
export const validateAutoraceRacePlayerId = (
    value: string,
): AutoraceRacePlayerId => {
    const result = AutoraceRacePlayerIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * オートレースのraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateAutoraceRaceId = (
    dateTime: Date,
    location: AutoraceRaceCourse,
    number: AutoraceRaceNumber,
): AutoraceRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateAutoracePlaceId(dateTime, location)}${numberCode}`;
};

/**
 * AutoraceRaceIdのzod型定義
 * autorace + 8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
 */
const AutoraceRaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('autorace');
    }, 'autoraceから始まる必要があります')
    // autoraceの後に8桁の数字（開催日） + 2桁の数字（開催場所）+ 2桁の数字（レース番号）
    .refine((value) => {
        return /^autorace\d{8}\d{2}\d{2}$/.test(value);
    }, 'AutoraceRaceIdの形式ではありません')
    // レース番号は1~12の範囲
    .refine((value) => {
        const raceNumber = parseInt(value.slice(-2));
        return AutoraceRaceNumberSchema.safeParse(raceNumber).success;
    }, 'レース番号は1~12の範囲である必要があります');

/**
 * AutoraceRaceIdの型定義
 */
export type AutoraceRaceId = z.infer<typeof AutoraceRaceIdSchema>;

/**
 * AutoraceRaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのAutoraceRaceId
 */
export const validateAutoraceRaceId = (value: string): AutoraceRaceId => {
    const result = AutoraceRaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};

/**
 * オートレースのplaceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 */
export const generateAutoracePlaceId = (
    dateTime: Date,
    location: AutoraceRaceCourse,
): AutoracePlaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = AUTORACE_PLACE_CODE[location];
    return `autorace${dateCode}${locationCode}`;
};

/**
 * AutoracePlaceIdのzod型定義
 * autorace + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const AutoracePlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('autorace');
    }, 'autoraceから始まる必要があります')
    .refine((value) => {
        return /^autorace\d{8}\d{2}$/.test(value);
    }, 'AutoracePlaceIdの形式ではありません');

/**
 * AutoracePlaceIdの型定義
 */
export type AutoracePlaceId = z.infer<typeof AutoracePlaceIdSchema>;

/**
 * AutoracePlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのAutoracePlaceId
 */
export const validateAutoracePlaceId = (value: string): AutoracePlaceId => {
    const result = AutoracePlaceIdSchema.safeParse(value);
    if (!result.success) {
        throw new Error(result.error.message);
    }
    return result.data;
};
