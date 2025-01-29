import { container } from 'tsyringe';

import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import { JraGoogleCalendarRepository } from '../../src/repository/implement/jraGoogleCalendarRepository';
import type { ICalendarRepository } from '../../src/repository/interface/ICalendarRepository';

container.register<ICalendarRepository<JraRaceEntity>>(
    'JraCalendarRepository',
    { useClass: JraGoogleCalendarRepository },
);
