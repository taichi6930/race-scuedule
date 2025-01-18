import { container } from 'tsyringe';

import type { AutoracePlaceEntity } from '../src/repository/entity/autoracePlaceEntity';
import type { AutoraceRaceEntity } from '../src/repository/entity/autoraceRaceEntity';
import type { BoatracePlaceEntity } from '../src/repository/entity/boatracePlaceEntity';
import type { BoatraceRaceEntity } from '../src/repository/entity/boatraceRaceEntity';
import type { JraPlaceEntity } from '../src/repository/entity/jraPlaceEntity';
import type { JraRaceEntity } from '../src/repository/entity/jraRaceEntity';
import type { KeirinPlaceEntity } from '../src/repository/entity/keirinPlaceEntity';
import type { KeirinRaceEntity } from '../src/repository/entity/keirinRaceEntity';
import type { NarPlaceEntity } from '../src/repository/entity/narPlaceEntity';
import type { NarRaceEntity } from '../src/repository/entity/narRaceEntity';
import type { WorldPlaceEntity } from '../src/repository/entity/worldPlaceEntity';
import type { WorldRaceEntity } from '../src/repository/entity/worldRaceEntity';
import { AutoracePlaceDataService } from '../src/service/implement/autoracePlaceDataService';
import { BoatracePlaceDataService } from '../src/service/implement/boatracePlaceDataService';
import { GoogleCalendarService } from '../src/service/implement/googleCalendarService';
import { JraPlaceDataService } from '../src/service/implement/jraPlaceDataService';
import { JraRaceDataService } from '../src/service/implement/jraRaceDataService';
import { KeirinPlaceDataService } from '../src/service/implement/keirinPlaceDataService';
import { KeirinRaceDataService } from '../src/service/implement/keirinRaceDataService';
import { NarPlaceDataService } from '../src/service/implement/narPlaceDataService';
import { NarRaceDataService } from '../src/service/implement/narRaceDataService';
import { WorldRaceDataService } from '../src/service/implement/worldRaceDataService';
import type { ICalendarService } from '../src/service/interface/ICalendarService';
import type { IPlaceDataService } from '../src/service/interface/IPlaceDataService';
import type { IRaceDataService } from '../src/service/interface/IRaceDataService';
import { MockGoogleCalendarService } from '../src/service/mock/mockGoogleCalendarService';
import { ENV } from '../src/utility/env';

// ICalendarServiceの実装クラスをDIコンテナに登錄する
container.register<ICalendarService<NarRaceEntity>>('NarCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<NarRaceEntity>(
                    'nar',
                    process.env.NAR_CALENDAR_ID ?? '',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                // ENV が指定されていない場合も MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('nar');
        }
    },
});

container.register<ICalendarService<JraRaceEntity>>('JraCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<JraRaceEntity>(
                    'jra',
                    process.env.JRA_CALENDAR_ID ?? '',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                // ENV が指定されていない場合も MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('jra');
        }
    },
});

container.register<ICalendarService<KeirinRaceEntity>>(
    'KeirinCalendarService',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、GoogleCalendarService を使用
                    return new GoogleCalendarService<KeirinRaceEntity>(
                        'keirin',
                        process.env.KEIRIN_CALENDAR_ID ?? '',
                    );
                case 'ITa':
                case 'LOCAL':
                default:
                    // ENV が指定されていない場合も MockGoogleCalendarService を使用
                    return new MockGoogleCalendarService('keirin');
            }
        },
    },
);

container.register<ICalendarService<WorldRaceEntity>>('WorldCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<WorldRaceEntity>(
                    'world',
                    process.env.WORLD_CALENDAR_ID ?? '',
                );
            case 'ITa':
            case 'LOCAL':
            default:
                // ENV が指定されていない場合も MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('world');
        }
    },
});

container.register<ICalendarService<AutoraceRaceEntity>>(
    'AutoraceCalendarService',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、GoogleCalendarService を使用
                    return new GoogleCalendarService<AutoraceRaceEntity>(
                        'autorace',
                        process.env.AUTORACE_CALENDAR_ID ?? '',
                    );
                case 'ITa':
                case 'LOCAL':
                default:
                    // ENV が指定されていない場合も MockGoogleCalendarService を使用
                    return new MockGoogleCalendarService('autorace');
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
                    // ENV が production の場合、GoogleCalendarService を使用
                    return new GoogleCalendarService<BoatraceRaceEntity>(
                        'boatrace',
                        process.env.BOATRACE_CALENDAR_ID ?? '',
                    );
                case 'ITa':
                case 'LOCAL':
                default:
                    // ENV が指定されていない場合も MockGoogleCalendarService を使用
                    return new MockGoogleCalendarService('boatrace');
            }
        },
    },
);

container.register<IPlaceDataService<JraPlaceEntity>>('JraPlaceDataService', {
    useClass: JraPlaceDataService,
});
container.register<IRaceDataService<JraRaceEntity, JraPlaceEntity>>(
    'JraRaceDataService',
    {
        useClass: JraRaceDataService,
    },
);

container.register<IPlaceDataService<NarPlaceEntity>>('NarPlaceDataService', {
    useClass: NarPlaceDataService,
});
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

container.register<IPlaceDataService<KeirinPlaceEntity>>(
    'KeirinPlaceDataService',
    {
        useClass: KeirinPlaceDataService,
    },
);
container.register<IRaceDataService<KeirinRaceEntity, KeirinPlaceEntity>>(
    'KeirinRaceDataService',
    {
        useClass: KeirinRaceDataService,
    },
);

container.register<IPlaceDataService<AutoracePlaceEntity>>(
    'AutoracePlaceDataService',
    {
        useClass: AutoracePlaceDataService,
    },
);

container.register<IPlaceDataService<BoatracePlaceEntity>>(
    'BoatracePlaceDataService',
    {
        useClass: BoatracePlaceDataService,
    },
);
