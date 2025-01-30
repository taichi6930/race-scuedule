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
import { WorldGoogleCalendarService } from '../../src/service/implement/worldGoogleCalendarService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import { MockWorldGoogleCalendarService } from '../../src/service/mock/mockWorldGoogleCalendarService';
import { ENV } from '../../src/utility/env';

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
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、WorldGoogleCalendarService を使用
                return new WorldGoogleCalendarService(
                    process.env.WORLD_CALENDAR_ID ?? '',
                );
            case 'TEST':
                // ENV が test の場合、KeirinGoogleCalendarService を使用
                return new WorldGoogleCalendarService(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            case 'LOCAL':
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
                // ENV が指定されていない場合も MockGoogleCalendarService を使用
                return new MockWorldGoogleCalendarService();
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
