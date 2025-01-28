import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../../src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../../src/repository/entity/autoraceRaceEntity';
import type { BoatracePlaceEntity } from '../../src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../../src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../../src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { KeirinPlaceEntity } from '../../src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../../src/repository/entity/keirinRaceEntity';
import type { NarPlaceEntity } from '../../src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../../src/repository/entity/narRaceEntity';
import type { WorldPlaceEntity } from '../../src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
import { AutoraceRaceDataService } from '../../src/service/implement/autoraceRaceDataService';
import { BoatraceRaceDataService } from '../../src/service/implement/boatraceRaceDataService';
import { JraRaceDataService } from '../../src/service/implement/jraRaceDataService';
import { KeirinRaceDataService } from '../../src/service/implement/keirinRaceDataService';
import { NarRaceDataService } from '../../src/service/implement/narRaceDataService';
import { WorldRaceDataService } from '../../src/service/implement/worldRaceDataService';
import type { IRaceDataService } from '../../src/service/interface/IRaceDataService';

container.register<IRaceDataService<JraRaceEntity, JraPlaceEntity>>(
    'JraRaceDataService',
    {
        useClass: JraRaceDataService,
    },
);

container.register<IRaceDataService<NarRaceEntity, NarPlaceEntity>>(
    'NarRaceDataService',
    {
        useClass: NarRaceDataService,
    },
);

container.register<IRaceDataService<WorldRaceEntity, WorldPlaceEntity>>(
    'WorldRaceDataService',
    {
        useClass: WorldRaceDataService,
    },
);

container.register<IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>>(
    'KeirinRaceDataService',
    {
        useClass: KeirinRaceDataService,
    },
);

container.register<IRaceDataService<AutoraceRaceEntity, AutoracePlaceEntity>>(
    'AutoraceRaceDataService',
    {
        useClass: AutoraceRaceDataService,
    },
);

container.register<IRaceDataService<BoatraceRaceEntity, BoatracePlaceEntity>>(
    'BoatraceRaceDataService',
    {
        useClass: BoatraceRaceDataService,
    },
);
