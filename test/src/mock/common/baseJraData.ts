import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import { JraPlaceRecord } from '../../../../lib/src/gateway/record/jraPlaceRecord';
import { JraRaceRecord } from '../../../../lib/src/gateway/record/jraRaceRecord';
import { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import type {
    JraGradeType,
    JraRaceCourse,
} from '../../../../lib/src/utility/data/jra';
import {
    generateJraPlaceId,
    generateJraRaceId,
} from '../../../../lib/src/utility/raceId';

const baseJraPlaceCourse: JraRaceCourse = '中山';
const baseJraPlaceDateTime = new Date('2024-12-22');

const baseJraRaceName = '有馬記念';
const baseJraRaceDateTime = new Date('2024-12-22 15:40');
const baseJraRaceNumber = 11;
const baseJraRaceSurfaceType = '芝';
const baseJraRaceDistance = 2500;
const baseJraRaceGrade: JraGradeType = 'GⅠ';
const baseJraRaceHeldTimes = 5;
const baseJraRaceHeldDayTimes = 8;

export const baseJraPlaceData = new JraPlaceData(
    baseJraPlaceDateTime,
    baseJraPlaceCourse,
    1,
    1,
);

export const baseJraRaceData = new JraRaceData(
    baseJraRaceName,
    baseJraRaceDateTime,
    baseJraPlaceCourse,
    baseJraRaceSurfaceType,
    baseJraRaceDistance,
    baseJraRaceGrade,
    baseJraRaceNumber,
    baseJraRaceHeldTimes,
    baseJraRaceHeldDayTimes,
);

export const baseJraPlaceRecord = new JraPlaceRecord(
    generateJraPlaceId(baseJraPlaceDateTime, baseJraPlaceCourse),
    baseJraPlaceDateTime,
    baseJraPlaceCourse,
    baseJraRaceHeldTimes,
    baseJraRaceHeldDayTimes,
);

export const baseJraRaceRecord = new JraRaceRecord(
    generateJraRaceId(
        baseJraPlaceDateTime,
        baseJraPlaceCourse,
        baseJraRaceNumber,
    ),
    baseJraRaceName,
    baseJraRaceDateTime,
    baseJraPlaceCourse,
    baseJraRaceSurfaceType,
    baseJraRaceDistance,
    baseJraRaceGrade,
    baseJraRaceNumber,
    baseJraRaceHeldTimes,
    baseJraRaceHeldDayTimes,
);

export const baseJraPlaceEntity = new JraPlaceEntity(null, baseJraPlaceData);

export const baseJraRaceEntity = new JraRaceEntity(null, baseJraRaceData);

export const baseJraRaceEntityList: JraRaceEntity[] = ['東京', '京都'].flatMap(
    (location) => {
        return [
            '新馬',
            '未勝利',
            '未勝利',
            '1勝クラス',
            '2勝クラス',
            '3勝クラス',
            'オープン特別',
            'Listed',
            'GⅢ',
            'GⅡ',
            'GⅠ',
            '2勝クラス',
        ].map((grade, index) => {
            return new JraRaceEntity(
                null,
                new JraRaceData(
                    `テスト${location}${grade}${(index + 1).toString()}レース`,
                    new Date(2024, 6 - 1, 1, 7 + index, 0),
                    location as JraRaceCourse,
                    '芝',
                    1600,
                    grade as JraGradeType,
                    index + 1,
                    1,
                    1,
                ),
            );
        });
    },
);

export const baseJraRaceDataList = baseJraRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseJraCalendarData = new CalendarData(
    'test202412220611',
    '有馬記念',
    new Date('2024-12-22T15:40:00Z'),
    new Date('2024-12-22T15:50:00Z'),
    '中山競馬場',
    'テスト',
);

export const baseJraCalendarDataFromGoogleCalendar = {
    id: 'test202412220611',
    summary: '有馬記念',
    start: {
        dateTime: '2024-12-22T15:40:00Z',
    },
    end: {
        dateTime: '2024-12-22T15:50:00Z',
    },
    location: '中山競馬場',
    description: 'テスト',
};
