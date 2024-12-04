import { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import { AutoraceRacePlayerData } from '../../../../lib/src/domain/autoraceRacePlayerData';
import { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import { BoatraceRacePlayerData } from '../../../../lib/src/domain/boatraceRacePlayerData';
import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { AutoracePlaceRecord } from '../../../../lib/src/gateway/record/autoracePlaceRecord';
import { AutoraceRacePlayerRecord } from '../../../../lib/src/gateway/record/autoraceRacePlayerRecord';
import { AutoraceRaceRecord } from '../../../../lib/src/gateway/record/autoraceRaceRecord';
import { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import { BoatraceRacePlayerRecord } from '../../../../lib/src/gateway/record/boatraceRacePlayerRecord';
import { BoatraceRaceRecord } from '../../../../lib/src/gateway/record/boatraceRaceRecord';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import type {
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceStage,
} from '../../../../lib/src/utility/data/autorace';
import type {
    BoatraceGradeType,
    BoatraceRaceCourse,
    BoatraceRaceStage,
} from '../../../../lib/src/utility/data/boatrace';

export const baseAutoracePlaceData = new AutoracePlaceData(
    new Date('2024-12-31'),
    '飯塚',
    'SG',
);
export const baseAutoracePlaceEntity = new AutoracePlaceEntity(
    null,
    baseAutoracePlaceData,
);
export const baseAutoracePlaceRecord = AutoracePlaceRecord.fromDomainData(
    baseAutoracePlaceData,
);

export const baseAutoraceRaceEntityList: AutoraceRaceEntity[] = [
    { location: '飯塚', grade: 'SG' },
    { location: '川口', grade: 'GⅠ' },
    { location: '山陽', grade: '特GⅠ' },
    { location: '伊勢崎', grade: 'GⅡ' },
    { location: '浜松', grade: '開催' },
].flatMap((value) => {
    const { location, grade } = value;
    return [
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '優勝戦',
    ].map((stage, index) => {
        return new AutoraceRaceEntity(
            null,
            new AutoraceRaceData(
                `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
                stage as AutoraceRaceStage,
                new Date(2025, 12 - 1, 31, 7 + index, 0),
                location as AutoraceRaceCourse,
                grade as AutoraceGradeType,
                index + 1,
            ),
            [],
        );
    });
});

export const baseAutoraceRaceDataList = baseAutoraceRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
);

export const baseAutoraceRacePlayerData = new AutoraceRacePlayerData(1, 10000);

export const baseAutoraceRacePlayerDataList = Array.from(
    { length: 8 },
    (_, i) => {
        return new AutoraceRacePlayerData(i + 1, i + 1);
    },
);

export const baseAutoraceRaceData = new AutoraceRaceData(
    'スーパースター王座決定戦',
    '優勝戦',
    new Date('2024-12-31 16:30'),
    '飯塚',
    'SG',
    11,
);
export const baseAutoraceRaceEntity = new AutoraceRaceEntity(
    null,
    baseAutoraceRaceData,
    baseAutoraceRacePlayerDataList,
);

export const baseAutoraceRaceRecord =
    AutoraceRaceRecord.fromDomainData(baseAutoraceRaceData);

export const baseAutoraceRacePlayerRecord = new AutoraceRacePlayerRecord(
    'autorace20241231051101',
    'autorace202412310511',
    1,
    10000,
);

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
export const baseBoatraceRacePlayerRecord = new BoatraceRacePlayerRecord(
    'boatrace20241231051101',
    'boatrace202412310511',
    1,
    10000,
);

export const baseBoatraceRaceEntityList: BoatraceRaceEntity[] = [
    { location: '平和島', grade: 'SG' },
    { location: '戸田', grade: 'GⅠ' },
    { location: '江戸川', grade: 'GⅡ' },
    { location: '桐生', grade: 'GⅢ' },
    { location: '多摩川', grade: '一般' },
].flatMap((value) => {
    const { location, grade } = value;
    return [
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '一般戦',
        '優勝戦',
    ].map((stage, index) => {
        const raceData = new BoatraceRaceData(
            `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
            stage as BoatraceRaceStage,
            new Date(2025, 12 - 1, 30, 7 + index, 0),
            location as BoatraceRaceCourse,
            grade as BoatraceGradeType,
            index + 1,
        );
        const racePlayerDataList = Array.from({ length: 6 }, (_, i) => {
            return new BoatraceRacePlayerData(i + 1, i + 1);
        });
        return new BoatraceRaceEntity(null, raceData, racePlayerDataList);
    });
});

export const baseBoatraceRaceDataList = baseBoatraceRaceEntityList.map(
    (raceEntity) => raceEntity.raceData,
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
export const baseBoatraceRaceRecord =
    BoatraceRaceRecord.fromDomainData(baseBoatraceRaceData);

export const baseBoatraceRacePlayerData = new BoatraceRacePlayerData(1, 10000);

export const baseBoatraceRacePlayerDataList = Array.from(
    { length: 6 },
    (_, i) => {
        return new BoatraceRacePlayerData(i + 1, i + 1);
    },
);

export const baseBoatraceRaceEntity = new BoatraceRaceEntity(
    null,
    baseBoatraceRaceData,
    [baseBoatraceRacePlayerData],
);

export const baseBoatraceCalendarData = new CalendarData(
    'test202412310511',
    'グランプリ',
    new Date('2024-12-31T16:30:00Z'),
    new Date('2024-12-31T16:40:00Z'),
    '平和島ボートレース場',
    'テスト',
);

export const baseBoatraceCalendarDataFromGoogleCalendar = {
    id: 'test202412310511',
    summary: 'グランプリ',
    start: {
        dateTime: '2024-12-31T16:30:00Z',
    },
    end: {
        dateTime: '2024-12-31T16:40:00Z',
    },
    location: '平和島ボートレース場',
    description: 'テスト',
};
