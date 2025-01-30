import { container } from 'tsyringe';

import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
import { WorldGoogleCalendarRepositoryImpl } from '../../src/repository/implement/worldGoogleCalendarRepositoryImpl';
import type { ICalendarRepository } from '../../src/repository/interface/ICalendarRepository';

container.register<ICalendarRepository<WorldRaceEntity>>(
    'WorldCalendarRepository',
    { useClass: WorldGoogleCalendarRepositoryImpl },
);
