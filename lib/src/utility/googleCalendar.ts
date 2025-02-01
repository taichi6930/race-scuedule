import type { JraGradeType } from './data/jra/jraGradeType';
import type { NarGradeType } from './data/nar/narGradeType';

/**
 * Google Calendar APIの色ID
 */
const GoogleCalendarColorId = {
    LAVENDER: '1', // #7986CB
    SAGE: '2', // #33B679
    GRAPE: '3', // #8E24AA
    FLAMINGO: '4', // #E67C73
    BANANA: '5', // #F6BF26
    TANGERINE: '6', // #F4511E
    PEACOCK: '7', // #039BE5
    GRAPHITE: '8', // #616161
    BLUEBERRY: '9', // #3F51B5
    BASIL: '10', // #0B8043
    TOMATO: '11', // #D50000
} as const;

/**
 * Google Calendar APIの色IDの型
 */
type GoogleCalendarColorIdType =
    (typeof GoogleCalendarColorId)[keyof typeof GoogleCalendarColorId];

/**
 * 中央競馬のGoogleカレンダーの色ID
 */
const JraGoogleCalendarColorIdMap: Record<
    JraGradeType,
    GoogleCalendarColorIdType
> = {
    'GⅠ': GoogleCalendarColorId.BLUEBERRY,
    'GⅡ': GoogleCalendarColorId.TOMATO,
    'GⅢ': GoogleCalendarColorId.BASIL,
    'J.GⅠ': GoogleCalendarColorId.BLUEBERRY,
    'J.GⅡ': GoogleCalendarColorId.TOMATO,
    'J.GⅢ': GoogleCalendarColorId.BASIL,
    'JpnⅠ': GoogleCalendarColorId.LAVENDER,
    'JpnⅡ': GoogleCalendarColorId.FLAMINGO,
    'JpnⅢ': GoogleCalendarColorId.SAGE,
    '重賞': GoogleCalendarColorId.BANANA,
    'Listed': GoogleCalendarColorId.BANANA,
    'オープン': GoogleCalendarColorId.TANGERINE,
    'オープン特別': GoogleCalendarColorId.TANGERINE,
};

/**
 * 中央競馬のGoogleカレンダーの色IDを取得する
 * @param raceGrade
 * @returns
 */
export const getGoogleJraCalendarColorId = (
    raceGrade: JraGradeType,
): GoogleCalendarColorIdType => {
    return (
        JraGoogleCalendarColorIdMap[raceGrade] ?? GoogleCalendarColorId.GRAPHITE
    );
};

/**
 * 地方競馬のGoogleカレンダーの色ID
 */
const NarGoogleCalendarColorIdMap: Record<
    NarGradeType,
    GoogleCalendarColorIdType
> = {
    GⅠ: GoogleCalendarColorId.BLUEBERRY,
    GⅡ: GoogleCalendarColorId.TOMATO,
    GⅢ: GoogleCalendarColorId.BASIL,
    JpnⅠ: GoogleCalendarColorId.LAVENDER,
    JpnⅡ: GoogleCalendarColorId.FLAMINGO,
    JpnⅢ: GoogleCalendarColorId.SAGE,
    重賞: GoogleCalendarColorId.BANANA,
    Listed: GoogleCalendarColorId.BANANA,
    オープン: GoogleCalendarColorId.TANGERINE,
    オープン特別: GoogleCalendarColorId.TANGERINE,
    地方重賞: GoogleCalendarColorId.GRAPE,
};

/**
 * 地方競馬Googleカレンダーの色IDを取得する
 * @param raceGrade
 * @returns
 */
export const getNarGoogleNarCalendarColorId = (
    raceGrade: NarGradeType,
): GoogleCalendarColorIdType => {
    return (
        NarGoogleCalendarColorIdMap[raceGrade] ?? GoogleCalendarColorId.GRAPHITE
    );
};
