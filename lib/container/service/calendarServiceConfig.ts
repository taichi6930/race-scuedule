import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../../src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../src/repository/entity/boatraceRaceEntity';
import type { JraRaceEntity } from '../../src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../src/repository/entity/keirinRaceEntity';
import type { NarRaceEntity } from '../../src/repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../../src/repository/entity/worldRaceEntity';
import { AutoraceGoogleCalendarService } from '../../src/service/implement/autoraceGoogleCalendarService';
import { BoatraceGoogleCalendarService } from '../../src/service/implement/boatraceGoogleCalendarService';
import { JraCalendarService } from '../../src/service/implement/jraCalendarService';
import { KeirinGoogleCalendarService } from '../../src/service/implement/keirinGoogleCalendarService';
import { NarCalendarService } from '../../src/service/implement/narCalendarService';
import { WorldGoogleCalendarService } from '../../src/service/implement/worldGoogleCalendarService';
import type { ICalendarService } from '../../src/service/interface/ICalendarService';
import { MockAutoraceGoogleCalendarService } from '../../src/service/mock/mockAutoraceGoogleCalendarService';
import { MockBoatraceGoogleCalendarService } from '../../src/service/mock/mockBoatraceGoogleCalendarService';
import { MockKeirinGoogleCalendarService } from '../../src/service/mock/mockKeirinGoogleCalendarService';
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
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、KeirinGoogleCalendarService を使用
                    return new KeirinGoogleCalendarService(
                        process.env.KEIRIN_CALENDAR_ID ?? '',
                    );
                case 'TEST':
                    // ENV が test の場合、KeirinGoogleCalendarService を使用
                    return new KeirinGoogleCalendarService(
                        process.env.TEST_CALENDAR_ID ?? '',
                    );
                case 'LOCAL':
                case 'LOCAL_NO_INIT_DATA':
                case 'LOCAL_INIT_MADE_DATA':
                    // ENV が指定されていない場合も MockGoogleCalendarService を使用
                    return new MockKeirinGoogleCalendarService();
                default:
                    throw new Error('Invalid ENV value');
            }
        },
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
                return new MockWorldGoogleCalendarService('world');
            default:
                throw new Error('Invalid ENV value');
        }
    },
});

container.register<ICalendarService<AutoraceRaceEntity>>(
    'AutoraceCalendarService',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、AutoraceGoogleCalendarService を使用
                    return new AutoraceGoogleCalendarService(
                        process.env.AUTORACE_CALENDAR_ID ?? '',
                    );
                case 'TEST':
                    // ENV が test の場合、AutoraceGoogleCalendarService を使用
                    return new AutoraceGoogleCalendarService(
                        process.env.TEST_CALENDAR_ID ?? '',
                    );
                case 'LOCAL':
                case 'LOCAL_NO_INIT_DATA':
                case 'LOCAL_INIT_MADE_DATA':
                    // ENV が指定されていない場合も MockGoogleCalendarService を使用
                    return new MockAutoraceGoogleCalendarService();
                default:
                    throw new Error('Invalid ENV value');
            }
        },
    },
);

container.register<ICalendarService<BoatraceRaceEntity>>(
    'BoatraceCalendarService',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、BoatraceGoogleCalendarService を使用
                    return new BoatraceGoogleCalendarService(
                        process.env.BOATRACE_CALENDAR_ID ?? '',
                    );
                case 'TEST':
                    // ENV が test の場合、BoatraceGoogleCalendarService を使用
                    return new BoatraceGoogleCalendarService(
                        process.env.TEST_CALENDAR_ID ?? '',
                    );
                case 'LOCAL':
                case 'LOCAL_NO_INIT_DATA':
                case 'LOCAL_INIT_MADE_DATA':
                    // ENV が指定されていない場合も MockGoogleCalendarService を使用
                    return new MockBoatraceGoogleCalendarService();
                default:
                    throw new Error('Invalid ENV value');
            }
        },
    },
);
