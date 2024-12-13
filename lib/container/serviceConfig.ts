import { container } from 'tsyringe';

import type { AutoraceRaceEntity } from '../src/repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../src/repository/entity/boatraceRaceEntity';
import type { JraRaceEntity } from '../src/repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../src/repository/entity/keirinRaceEntity';
import type { NarRaceEntity } from '../src/repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../src/repository/entity/worldRaceEntity';
import { GoogleCalendarService } from '../src/service/implement/googleCalendarService';
import type { ICalendarService } from '../src/service/interface/ICalendarService';
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
