import { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';

export const baseAutoracePlaceEntity = new AutoracePlaceEntity(
    null,
    new Date('2024-12-31'),
    '飯塚',
    'SG',
);
export const baseAutoracePlaceData = baseAutoracePlaceEntity.toDomainData();

export const baseAutoraceRaceEntity = new AutoraceRaceEntity(
    null,
    'スーパースター王座決定戦',
    '優勝戦',
    new Date('2024-12-31 16:30'),
    '飯塚',
    'SG',
    11,
);
export const baseAutoraceRaceData = baseAutoraceRaceEntity.toDomainData();
export const baseAutoraceCalendarData = new CalendarData(
    'test202412310511',
    'スーパースター王座決定戦',
    new Date('2024-12-31T16:30:00Z'),
    new Date('2024-12-31T16:40:00Z'),
    '飯塚オートレース場',
    'テスト',
);

export const baseAutoraceCalendarDataFromGoogleCalendar = {
    id: 'test202412310511',
    summary: 'スーパースター王座決定戦',
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: '飯塚オートレース場',
    description: 'テスト',
};

export const baseKeirinPlaceData = new KeirinPlaceData(
    new Date('2025-12-30'),
    '平塚',
    'GP',
);

export const baseKeirinPlaceEntity = new KeirinPlaceEntity(
    null,
    baseKeirinPlaceData,
);

export const baseKeirinRaceData = new KeirinRaceData(
    'KEIRINグランプリ',
    'グランプリ',
    new Date('2025-12-30 16:30'),
    '平塚',
    'GP',
    11,
);

export const baseKeirinRaceEntity = new KeirinRaceEntity(
    null,
    baseKeirinRaceData,
);
export const baseKeirinCalendarData = new CalendarData(
    'test202512303511',
    'KEIRINグランプリ',
    new Date('2024-12-31T16:30:00Z'),
    new Date('2024-12-31T16:40:00Z'),
    '平塚競輪場',
    'テスト',
);

export const baseKeirinCalendarDataFromGoogleCalendar = {
    id: 'test202512303511',
    summary: 'KEIRINグランプリ',
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: '平塚競輪場',
    description: 'テスト',
};

export const baseWorldPlaceEntity = new WorldPlaceEntity(
    null,
    new Date('2024-10-01'),
    'パリロンシャン',
);
export const baseWorldPlaceData = baseWorldPlaceEntity.toDomainData();

export const baseWorldRaceEntity = new WorldRaceEntity(
    null,
    '凱旋門賞',
    new Date('2024-10-01 16:30'),
    'パリロンシャン',
    '芝',
    2400,
    'GⅠ',
    11,
);
export const baseWorldRaceData = baseWorldRaceEntity.toDomainData();

export const baseWorldCalendarData = new CalendarData(
    'test20241001longchamp01',
    '凱旋門賞',
    new Date('2024-10-01T16:30:00Z'),
    new Date('2024-10-01T16:40:00Z'),
    'パリロンシャン競馬場',
    'テスト',
);

export const baseWorldCalendarDataFromGoogleCalendar = {
    id: 'test20241001longchamp01',
    summary: '凱旋門賞',
    start: {
        dateTime: '2024-10-01T16:30:00Z',
    },
    end: {
        dateTime: '2024-10-01T16:40:00Z',
    },
    location: 'パリロンシャン競馬場',
    description: 'テスト',
};

export const baseNarPlaceEntity = new NarPlaceEntity(
    null,
    new Date('2024-06-03'),
    '大井',
);
export const baseNarPlaceData = baseNarPlaceEntity.toDomainData();

export const baseNarRaceEntity = new NarRaceEntity(
    null,
    '東京ダービー',
    new Date('2024-06-03 20:10'),
    '大井',
    'ダート',
    2000,
    'JpnⅠ',
    11,
);
export const baseNarRaceData = baseNarRaceEntity.toDomainData();

export const baseNarCalendarData = new CalendarData(
    'test202406032011',
    '東京ダービー',
    new Date('2024-06-03T20:10:00Z'),
    new Date('2024-06-03T20:20:00Z'),
    '大井競馬場',
    'テスト',
);

export const baseNarCalendarDataFromGoogleCalendar = {
    id: 'test202406032011',
    summary: '東京ダービー',
    start: {
        dateTime: '2024-06-03T20:10:00Z',
    },
    end: {
        dateTime: '2024-06-03T20:20:00Z',
    },
    location: '大井競馬場',
    description: 'テスト',
};

export const baseJraPlaceEntity = new JraPlaceEntity(
    null,
    new Date('2024-12-22'),
    '中山',
);
export const baseJraPlaceData = baseJraPlaceEntity.toDomainData();

export const baseJraRaceEntity = new JraRaceEntity(
    null,
    '有馬記念',
    new Date('2024-12-22 15:40'),
    '中山',
    '芝',
    2500,
    'GⅠ',
    11,
    1,
    1,
);
export const baseJraRaceData = baseJraRaceEntity.toDomainData();

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

export const baseBoatracePlaceRecord = new BoatracePlaceRecord(
    `boatrace2024123104`,
    new Date('2024-12-31'),
    '平和島',
    'SG',
);
export const baseBoatracePlaceData = new BoatracePlaceData(
    new Date('2024-12-31'),
    '平和島',
    'SG',
);

export const baseBoatracePlaceEntity = new BoatracePlaceEntity(
    null,
    baseBoatracePlaceData,
);

export const baseBoatraceRaceData = new BoatraceRaceData(
    'グランプリ',
    '優勝戦',
    new Date('2024-12-31 16:30'),
    '平和島',
    'SG',
    11,
);
// export const baseAutoraceRaceData = baseAutoraceRaceEntity.toDomainData();
// export const baseAutoraceCalendarData = new CalendarData(
//     'test202412310511',
//     'スーパースター王座決定戦',
//     new Date('2024-12-31T16:30:00Z'),
//     new Date('2024-12-31T16:40:00Z'),
//     '飯塚オートレース場',
//     'テスト',
// );

// export const baseAutoraceCalendarDataFromGoogleCalendar = {
//     id: 'test202412310511',
//     summary: 'スーパースター王座決定戦',
//     start: {
//         dateTime: '2024-12-31T16:30:00Z',
//     },
//     end: {
//         dateTime: '2024-12-31T16:40:00Z',
//     },
//     location: '飯塚オートレース場',
//     description: 'テスト',
// };
