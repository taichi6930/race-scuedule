import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import { NarPlaceRecord } from '../../../../lib/src/gateway/record/narPlaceRecord';
import { NarRaceRecord } from '../../../../lib/src/gateway/record/narRaceRecord';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import type {
    NarGradeType,
    NarRaceCourse,
} from '../../../../lib/src/utility/data/nar';
import {
    generateNarPlaceId,
    generateNarRaceId,
} from '../../../../lib/src/utility/raceId';

const baseNarPlaceCourse: NarRaceCourse = '大井';
const baseNarPlaceDateTime = new Date('2024-12-29');

const baseNarRaceName = '東京大賞典';
const baseNarRaceDateTime = new Date('2024-12-29 15:40');
const baseNarRaceNumber = 11;
const baseNarRaceSurfaceType = 'ダート';
const baseNarRaceDistance = 2000;
const baseNarRaceGrade: NarGradeType = 'GⅠ';
const baseNarRaceUpdateDate = new Date('2024-12-01 00:00');

export const baseNarPlaceData = new NarPlaceData(
    baseNarPlaceDateTime,
    baseNarPlaceCourse,
);

export const baseNarRaceData = new NarRaceData(
    baseNarRaceName,
    baseNarRaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceSurfaceType,
    baseNarRaceDistance,
    baseNarRaceGrade,
    baseNarRaceNumber,
);

export const baseNarPlaceRecord = new NarPlaceRecord(
    generateNarPlaceId(baseNarPlaceDateTime, baseNarPlaceCourse),
    baseNarPlaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceUpdateDate,
);

export const baseNarRaceRecord = new NarRaceRecord(
    generateNarRaceId(
        baseNarPlaceDateTime,
        baseNarPlaceCourse,
        baseNarRaceNumber,
    ),
    baseNarRaceName,
    baseNarRaceDateTime,
    baseNarPlaceCourse,
    baseNarRaceSurfaceType,
    baseNarRaceDistance,
    baseNarRaceGrade,
    baseNarRaceNumber,
    baseNarRaceUpdateDate,
);

export const baseNarPlaceEntity = new NarPlaceEntity(
    null,
    baseNarPlaceData,
    baseNarRaceUpdateDate,
);

export const baseNarRaceEntity = new NarRaceEntity(
    null,
    baseNarRaceData,
    baseNarRaceUpdateDate,
);

export const baseNarRaceEntityList: NarRaceEntity[] = ['大井', '高知'].flatMap(
    (location) => {
        return [
            '一般',
            '一般',
            '一般',
            'オープン特別',
            'Listed',
            'JpnⅢ',
            'JpnⅡ',
            'JpnⅠ',
            'GⅢ',
            'GⅡ',
            'GⅠ',
            '地方重賞',
        ].map((grade, index) => {
            return new NarRaceEntity(
                null,
                new NarRaceData(
                    `テスト${location}${grade}${(index + 1).toString()}レース`,
                    new Date(2024, 6 - 1, 1, 7 + index, 0),
                    location,
                    'ダート',
                    1600,
                    grade as NarGradeType,
                    index + 1,
                ),
                baseNarRaceUpdateDate,
            );
        });
    },
);

export const baseNarRaceDataList = baseNarRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseNarCalendarData = new CalendarData(
    'test202412292011',
    '東京大賞典',
    new Date('2024-12-29T15:40:00Z'),
    new Date('2024-12-29T15:50:00Z'),
    '大井競馬場',
    'テスト',
);

export const baseNarCalendarDataFromGoogleCalendar = {
    id: 'test202412292011',
    summary: '東京大賞典',
    start: {
        dateTime: '2024-12-29T15:40:00Z',
    },
    end: {
        dateTime: '2024-12-29T15:50:00Z',
    },
    location: '大井競馬場',
    description: 'テスト',
};
