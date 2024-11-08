import { container } from 'tsyringe';

import type { AutoraceRaceData } from '../domain/autoraceRaceData';
import type { JraRaceData } from '../domain/jraRaceData';
import type { KeirinRaceData } from '../domain/keirinRaceData';
import type { NarRaceData } from '../domain/narRaceData';
import type { WorldRaceData } from '../domain/worldRaceData';
import { GoogleCalendarService } from '../service/implement/googleCalendarService';
import type { ICalendarService } from '../service/interface/ICalendarService';
import { MockGoogleCalendarService } from '../service/mock/mockGoogleCalendarService';
import { ENV } from '../utility/env';

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
