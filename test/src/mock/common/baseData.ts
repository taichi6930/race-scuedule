import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';
import { KeirinPlaceEntity } from '../../../../lib/src/repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../../../lib/src/repository/entity/keirinRaceEntity';
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

export const baseKeirinPlaceEntity = new KeirinPlaceEntity(
    null,
    new Date('2025-12-30'),
    '平塚',
    'GP',
);
export const baseKeirinPlaceData = baseKeirinPlaceEntity.toDomainData();

export const baseKeirinRaceEntity = new KeirinRaceEntity(
    null,
    'KEIRINグランプリ',
    'グランプリ',
    new Date('2025-12-30 16:30'),
    '平塚',
    'GP',
    11,
);
export const baseKeirinRaceData = baseKeirinRaceEntity.toDomainData();
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
