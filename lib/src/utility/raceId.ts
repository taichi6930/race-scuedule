import { format } from 'date-fns';

import type { AutoraceRaceCourse } from './data/autorace';
import { AUTORACE_PLACE_CODE } from './data/autorace';
import type { BoatraceRaceCourse } from './data/boatrace';
import { BOATRACE_PLACE_CODE } from './data/boatrace';
import type { JraRaceCourse } from './data/jra';
import type { KeirinRaceCourse } from './data/keirin';
import { KEIRIN_PLACE_CODE } from './data/keirin';
import type { NarRaceCourse } from './data/nar';
import { NETKEIBA_BABACODE } from './data/netkeiba';
import { WORLD_PLACE_CODE, type WorldRaceCourse } from './data/world';

/**
 * 中央競馬のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateJraRaceId = (
    dateTime: Date,
    location: JraRaceCourse,
    number: number,
): JraRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateJraPlaceId(dateTime, location)}${numberCode}`;
};

export type JraRaceId = `jra${string}`;

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

export type JraPlaceId = `jra${string}`;

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
    number: number,
): NarRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateNarPlaceId(dateTime, location)}${numberCode}`;
};

export type NarRaceId = `nar${string}`;

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

export type NarPlaceId = `nar${string}`;

/**
 * 海外競馬のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateWorldRaceId = (
    dateTime: Date,
    location: WorldRaceCourse,
    number: number,
): WorldRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateWorldPlaceId(dateTime, location)}${numberCode}`;
};

export type WorldRaceId = `world${string}`;

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

export type WorldPlaceId = `world${string}`;

/**
 * 競輪のracePlayerIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param frameNumber - 枠番
 */
export const generateKeirinRacePlayerId = (
    dateTime: Date,
    location: KeirinRaceCourse,
    number: number,
    frameNumber: number,
): KeirinRacePlayerId => {
    const frameNumberCode = frameNumber.toXDigits(2);
    return `${generateKeirinRaceId(dateTime, location, number)}${frameNumberCode}`;
};

export type KeirinRacePlayerId = `keirin${string}`;

/**
 * 競輪のraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateKeirinRaceId = (
    dateTime: Date,
    location: KeirinRaceCourse,
    number: number,
): KeirinRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateKeirinPlaceId(dateTime, location)}${numberCode}`;
};

export type KeirinRaceId = `keirin${string}`;

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

export type KeirinPlaceId = `keirin${string}`;

/**
 * ボートレースのracePlayerIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param frameNumber - 枠番
 */
export const generateBoatraceRacePlayerId = (
    dateTime: Date,
    location: BoatraceRaceCourse,
    number: number,
    frameNumber: number,
): BoatraceRacePlayerId => {
    const frameNumberCode = frameNumber.toXDigits(2);
    return `${generateBoatraceRaceId(dateTime, location, number)}${frameNumberCode}`;
};

export type BoatraceRacePlayerId = `boatrace${string}`;

/**
 * ボートレースのraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateBoatraceRaceId = (
    dateTime: Date,
    location: BoatraceRaceCourse,
    number: number,
): BoatraceRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateBoatracePlaceId(dateTime, location)}${numberCode}`;
};

export type BoatraceRaceId = `boatrace${string}`;

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

export type BoatracePlaceId = `boatrace${string}`;

/**
 * オートレースのracePlayerIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 * @param frameNumber - 枠番
 */
export const generateAutoraceRacePlayerId = (
    dateTime: Date,
    location: AutoraceRaceCourse,
    number: number,
    frameNumber: number,
): AutoraceRacePlayerId => {
    const frameNumberCode = frameNumber.toXDigits(2);
    return `${generateAutoraceRaceId(dateTime, location, number)}${frameNumberCode}`;
};

export type AutoraceRacePlayerId = `autorace${string}`;

/**
 * オートレースのraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateAutoraceRaceId = (
    dateTime: Date,
    location: AutoraceRaceCourse,
    number: number,
): AutoraceRaceId => {
    const numberCode = number.toXDigits(2);
    return `${generateAutoracePlaceId(dateTime, location)}${numberCode}`;
};

export type AutoraceRaceId = `autorace${string}`;

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

export type AutoracePlaceId = `autorace${string}`;
