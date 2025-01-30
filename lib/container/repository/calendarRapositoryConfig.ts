import { container } from 'tsyringe';

import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { NarRaceEntity } from '../../src/repository/entity/narRaceEntity';
import { JraGoogleCalendarRepositoryImpl } from '../../src/repository/implement/jraGoogleCalendarRepositoryImpl';
import { NarGoogleCalendarRepositoryImpl } from '../../src/repository/implement/narGoogleCalendarRepositoryImpl';
import type { ICalendarRepository } from '../../src/repository/interface/ICalendarRepository';

container.register<ICalendarRepository<JraRaceEntity>>(
    'JraCalendarRepository',
    { useClass: JraGoogleCalendarRepositoryImpl },
);

container.register<ICalendarRepository<NarRaceEntity>>(
    'NarCalendarRepository',
    { useClass: NarGoogleCalendarRepositoryImpl },
);
