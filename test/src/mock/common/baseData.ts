import { CalendarData } from '../../../../lib/src/domain/calendarData';
import { AutoracePlaceEntity } from '../../../../lib/src/repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../../../lib/src/repository/entity/autoraceRaceEntity';

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
    'test202512310511',
    'スーパースター王座決定戦',
    new Date('2024-12-31T16:30:00Z'),
    new Date('2024-12-31T16:40:00Z'),
    '飯塚オートレース場',
    'テスト',
);
