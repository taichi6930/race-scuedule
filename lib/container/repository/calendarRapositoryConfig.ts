import { container } from 'tsyringe';

import type { NarRaceEntity } from '../../src/repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
import { NarGoogleCalendarRepositoryImpl } from '../../src/repository/implement/narGoogleCalendarRepositoryImpl';
import { WorldGoogleCalendarRepositoryImpl } from '../../src/repository/implement/worldGoogleCalendarRepositoryImpl';
import type { ICalendarRepository } from '../../src/repository/interface/ICalendarRepository';

container.register<ICalendarRepository<WorldRaceEntity>>(
    'WorldCalendarRepository',
    { useClass: WorldGoogleCalendarRepositoryImpl },
);

container.register<ICalendarRepository<NarRaceEntity>>(
    'NarCalendarRepository',
    { useClass: NarGoogleCalendarRepositoryImpl },
);
