import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../../src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../src/repository/entity/boatraceRaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../src/repository/entity/keirinRaceEntity';
import type { NarRaceEntity } from '../../src/repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
import { AutoraceCalendarService } from '../../src/service/implement/autoraceCalendarService';
import { BoatraceCalendarService } from '../../src/service/implement/boatraceCalendarService';
import { JraCalendarService } from '../../src/service/implement/jraCalendarService';
import { KeirinCalendarService } from '../../src/service/implement/keirinCalendarService';
import { NarCalendarService } from '../../src/service/implement/narCalendarService';
import { WorldCalendarService } from '../../src/service/implement/worldCalendarService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';

container.register<ICalendarService<NarRaceEntity>>('NarCalendarService', {
    useClass: NarCalendarService,
});
container.register<ICalendarService<JraRaceEntity>>('JraCalendarService', {
    useClass: JraCalendarService,
});
container.register<ICalendarService<KeirinRaceEntity>>(
    'KeirinCalendarService',
    {
        useClass: KeirinCalendarService,
    },
);
container.register<ICalendarService<AutoraceRaceEntity>>(
    'AutoraceCalendarService',
    {
        useClass: AutoraceCalendarService,
    },
);
container.register<ICalendarService<BoatraceRaceEntity>>(
    'BoatraceCalendarService',
    {
        useClass: BoatraceCalendarService,
    },
);
container.register<ICalendarService<WorldRaceEntity>>('WorldCalendarService', {
    useClass: WorldCalendarService,
});
