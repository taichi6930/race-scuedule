import { AutoracePlaceData } from '../../../../lib/src/domain/autoracePlaceData';
import { AutoraceRaceData } from '../../../../lib/src/domain/autoraceRaceData';
import { AutoraceRacePlayerData } from '../../../../lib/src/domain/autoraceRacePlayerData';
import { BoatracePlaceData } from '../../../../lib/src/domain/boatracePlaceData';
import { BoatraceRaceData } from '../../../../lib/src/domain/boatraceRaceData';
import { BoatraceRacePlayerData } from '../../../../lib/src/domain/boatraceRacePlayerData';
import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { JraPlaceData } from '../../../../lib/src/domain/jraPlaceData';
import { JraRaceData } from '../../../../lib/src/domain/jraRaceData';
import { KeirinPlaceData } from '../../../../lib/src/domain/keirinPlaceData';
import { KeirinRaceData } from '../../../../lib/src/domain/keirinRaceData';
import { KeirinRacePlayerData } from '../../../../lib/src/domain/keirinRacePlayerData';
import { NarPlaceData } from '../../../../lib/src/domain/narPlaceData';
import { NarRaceData } from '../../../../lib/src/domain/narRaceData';
import { WorldPlaceData } from '../../../../lib/src/domain/worldPlaceData';
import { WorldRaceData } from '../../../../lib/src/domain/worldRaceData';
import { BoatracePlaceRecord } from '../../../../lib/src/gateway/record/boatracePlaceRecord';
import { JraPlaceRecord } from '../../../../lib/src/gateway/record/jraPlaceRecord';
import { JraRaceRecord } from '../../../../lib/src/gateway/record/jraRaceRecord';
import { KeirinPlaceRecord } from '../../../../lib/src/gateway/record/keirinPlaceRecord';
import { KeirinRacePlayerRecord } from '../../../../lib/src/gateway/record/keirinRacePlayerRecord';
import { KeirinRaceRecord } from '../../../../lib/src/gateway/record/keirinRaceRecord';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import { BoatracePlaceEntity } from '../../../../lib/src/repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../../../lib/src/repository/entity/boatraceRaceEntity';
import { JraPlaceEntity } from '../../../../lib/src/repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
import { NarPlaceEntity } from '../../../../lib/src/repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import { WorldPlaceEntity } from '../../../../lib/src/repository/entity/worldPlaceEntity';
import { WorldRaceEntity } from '../../../../lib/src/repository/entity/worldRaceEntity';
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
import type {
    JraGradeType,
    JraRaceCourse,
} from '../../../../lib/src/utility/data/jra';
import type {
    KeirinGradeType,
    KeirinRaceCourse,
    KeirinRaceStage,
} from '../../../../lib/src/utility/data/keirin';
import type {
    NarGradeType,
    NarRaceCourse,
} from '../../../../lib/src/utility/data/nar';
import type {
    WorldGradeType,
    WorldRaceCourse,
} from '../../../../lib/src/utility/data/world';

export const baseAutoracePlaceData = new AutoracePlaceData(
    new Date('2024-12-31'),
    '飯塚',
    'SG',
);
export const baseAutoracePlaceEntity = new AutoracePlaceEntity(
    null,
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
    (raceEntity) => raceEntity.toDomainData(),
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

export const baseKeirinPlaceRecord = new KeirinPlaceRecord(
    `keirin2024123104`,
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
    'S級グランプリ',
    new Date('2025-12-30 16:30'),
    '平塚',
    'GP',
    11,
);

export const baseKeirinRaceRecord = new KeirinRaceRecord(
    `keirin202412310411`,
    'KEIRINグランプリ',
    'S級グランプリ',
    new Date('2025-12-30 16:30'),
    '平塚',
    'GP',
    11,
);

export const baseKeirinRacePlayerData = new KeirinRacePlayerData(1, 10000);

export const baseKeirinRacePlayerDataList = Array.from(
    { length: 9 },
    (_, i) => {
        return new KeirinRacePlayerData(i + 1, i + 1);
    },
);

export const baseKeirinRacePlayerRecord = new KeirinRacePlayerRecord(
    'keirin20241231041101',
    `keirin202412310411`,
    1,
    10000,
);

export const baseKeirinRaceEntityList: KeirinRaceEntity[] = [
    { location: '平塚', grade: 'GP' },
    { location: '立川', grade: 'GⅠ' },
    { location: '函館', grade: 'GⅡ' },
    { location: '小倉', grade: 'GⅢ' },
    { location: '浜松', grade: 'FⅠ' },
    { location: '名古屋', grade: 'FⅡ' },
].flatMap((value) => {
    const { location, grade } = value;
    return [
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '一般',
        '特別優秀',
        '決勝',
    ].map((stage, index) => {
        const raceData = new KeirinRaceData(
            `テスト${location}${grade}${stage}${(index + 1).toString()}レース`,
            stage as KeirinRaceStage,
            new Date(2025, 12 - 1, 30, 7 + index, 0),
            location as KeirinRaceCourse,
            grade as KeirinGradeType,
            index + 1,
        );
        const racePlayerDataList = Array.from({ length: 9 }, (_, i) => {
            return new KeirinRacePlayerData(i + 1, i + 1);
        });
        return new KeirinRaceEntity(null, raceData, racePlayerDataList);
    });
});

export const baseKeirinRaceDataList = baseKeirinRaceEntityList.map(
    (raceEntity) => raceEntity.toDomainData(),
);

export const baseKeirinRaceEntity = new KeirinRaceEntity(
    null,
    baseKeirinRaceData,
    baseKeirinRacePlayerDataList,
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

export const baseWorldPlaceData = new WorldPlaceData(
    new Date('2024-10-01'),
    'パリロンシャン',
);
export const baseWorldPlaceEntity = new WorldPlaceEntity(
    null,
    baseWorldPlaceData,
);

export const baseWorldRaceEntityList: WorldRaceEntity[] = [
    'パリロンシャン',
    'シャティン',
].flatMap((location) => {
    return [
        '格付けなし',
        '格付けなし',
        '格付けなし',
        '格付けなし',
        '格付けなし',
        '格付けなし',
        '格付けなし',
        'Listed',
        'GⅢ',
        'GⅡ',
        'GⅠ',
        '格付けなし',
    ].map((grade, index) => {
        return new WorldRaceEntity(
            null,
            new WorldRaceData(
                `テスト${location}${grade}${(index + 1).toString()}レース`,
                new Date(2024, 10 - 1, 1, 7 + index, 0),
                location as WorldRaceCourse,
                '芝',
                1600,
                grade as WorldGradeType,
                index + 1,
            ),
        );
    });
});

export const baseWorldRaceDataList = baseWorldRaceEntityList.map((raceEntity) =>
    raceEntity.toDomainData(),
);

export const baseWorldRaceData = new WorldRaceData(
    '凱旋門賞',
    new Date('2024-10-01 16:30'),
    'パリロンシャン',
    '芝',
    2400,
    'GⅠ',
    11,
);
export const baseWorldRaceEntity = new WorldRaceEntity(null, baseWorldRaceData);

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

export const baseNarPlaceData = new NarPlaceData(
    new Date('2024-06-03'),
    '大井',
);

export const baseNarPlaceEntity = new NarPlaceEntity(null, baseNarPlaceData);

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
                    location as NarRaceCourse,
                    'ダート',
                    1600,
                    grade as NarGradeType,
                    index + 1,
                ),
            );
        });
    },
);

export const baseNarRaceDataList = baseNarRaceEntityList.map((raceEntity) =>
    raceEntity.toDomainData(),
);

export const baseNarRaceData = new NarRaceData(
    '東京ダービー',
    new Date('2024-06-03 20:10'),
    '大井',
    'ダート',
    2000,
    'JpnⅠ',
    11,
);
export const baseNarRaceEntity = new NarRaceEntity(null, baseNarRaceData);

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

export const baseJraPlaceRecord = new JraPlaceRecord(
    `jra2024122205`,
    new Date('2024-12-22'),
    '中山',
    1,
    1,
);

export const baseJraRaceRecord = new JraRaceRecord(
    'jra202412220511',
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

export const baseJraPlaceData = new JraPlaceData(
    new Date('2024-12-22'),
    '中山',
    1,
    1,
);

export const baseJraPlaceEntity = new JraPlaceEntity(null, baseJraPlaceData);

export const baseJraRaceEntity = new JraRaceEntity(
    null,
    new JraRaceData(
        '有馬記念',
        new Date('2024-12-22 15:40'),
        '中山',
        '芝',
        2500,
        'GⅠ',
        11,
        1,
        1,
    ),
);

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

export const baseJraRaceDataList = baseJraRaceEntityList.map((raceEntity) =>
    raceEntity.toDomainData(),
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
    (raceEntity) => raceEntity.toDomainData(),
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
