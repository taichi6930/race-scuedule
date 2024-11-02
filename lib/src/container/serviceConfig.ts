import { container } from 'tsyringe';

import type { JraRaceData } from '../domain/jraRaceData';
import type { KeirinRaceData } from '../domain/keirinRaceData';
import type { NarRaceData } from '../domain/narRaceData';
import { GoogleCalendarService } from '../service/implement/googleCalendarService';
import type { ICalendarService } from '../service/interface/ICalendarService';
import { MockGoogleCalendarService } from '../service/mock/mockGoogleCalendarService';
import { ENV } from '../utility/env';

// ICalendarServiceの実装クラスをDIコンテナに登錄する
container.register<ICalendarService<NarRaceData>>('NarCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'production':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<NarRaceData>(
                    'nar',
                    process.env.NAR_CALENDAR_ID ?? '',
                );
            case 'ita':
            case 'local':
            default:
                // ENV が指定されていない場合も MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('nar');
        }
    },
});

container.register<ICalendarService<JraRaceData>>('JraCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'production':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<JraRaceData>(
                    'jra',
                    process.env.JRA_CALENDAR_ID ?? '',
                );
            case 'ita':
            case 'local':
            default:
                // ENV が指定されていない場合も MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('jra');
        }
    },
});

container.register<ICalendarService<KeirinRaceData>>('KeirinCalendarService', {
    useFactory: () => {
        switch (ENV) {
            case 'production':
                // ENV が production の場合、GoogleCalendarService を使用
                return new GoogleCalendarService<KeirinRaceData>(
                    'keirin',
                    process.env.KEIRIN_CALENDAR_ID ?? '',
                );
            case 'ita':
            case 'local':
            default:
                // ENV が指定されていない場合も MockGoogleCalendarService を使用
                return new MockGoogleCalendarService('keirin');
        }
    },
});
