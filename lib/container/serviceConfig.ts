import { container } from 'tsyringe';

import type { AutoraceRaceData } from '../src/domain/autoraceRaceData';
import type { BoatraceRaceData } from '../src/domain/boatraceRaceData';
import type { JraRaceData } from '../src/domain/jraRaceData';
import type { KeirinRaceData } from '../src/domain/keirinRaceData';
import type { NarRaceData } from '../src/domain/narRaceData';
import type { WorldRaceData } from '../src/domain/worldRaceData';
import { GoogleCalendarService } from '../src/service/implement/googleCalendarService';
import type { ICalendarService } from '../src/service/interface/ICalendarService';
import { MockGoogleCalendarService } from '../src/service/mock/mockGoogleCalendarService';
import { ENV } from '../src/utility/env';

// ICalendarServiceの実装クラスをDIコンテナに登錄する
container.register<ICalendarService<NarRaceData>>('NarCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<NarRaceData>(
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

container.register<ICalendarService<JraRaceData>>('JraCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<JraRaceData>(
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

container.register<ICalendarService<KeirinRaceData>>('KeirinCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<KeirinRaceData>(
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
});

container.register<ICalendarService<WorldRaceData>>('WorldCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<WorldRaceData>(
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

container.register<ICalendarService<AutoraceRaceData>>(
    'AutoraceCalendarService',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、GoogleCalendarService を使用
                    return new GoogleCalendarService<AutoraceRaceData>(
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

container.register<ICalendarService<BoatraceRaceData>>(
    'BoatraceCalendarService',
    {
        useFactory: () => {
            switch (ENV) {
                case 'PRODUCTION':
                    // ENV が production の場合、GoogleCalendarService を使用
                    return new GoogleCalendarService<BoatraceRaceData>(
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
