import { format } from 'date-fns';

import type { JraRaceCourse } from './data/jra';
import type { NarRaceCourse } from './data/nar';
import { NETKEIBA_BABACODE } from './data/netkeiba';

/**
 * JRAのraceIdを作成する
 * @param dateTime - 開催日時
 * @param location - 開催場所
 * @param number - レース番号
 */
export const generateJraRaceId = (
    dateTime: Date,
    location: JraRaceCourse,
    number: number,
): JraRaceId => {
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = NETKEIBA_BABACODE[location];
    const numberCode = number.toXDigits(2);
    return `jra${dateCode}${locationCode}${numberCode}`;
};

export type JraRaceId = `jra${string}`;

/**
 * JRAのplaceIdを作成する
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
    const dateCode = format(dateTime, 'yyyyMMdd');
    const locationCode = NETKEIBA_BABACODE[location];
    const numberCode = number.toXDigits(2);
    return `nar${dateCode}${locationCode}${numberCode}`;
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
