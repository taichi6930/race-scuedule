import { container } from 'tsyringe';

import { JraRaceData } from '../domain/jraRaceData';
import { KeirinRaceData } from '../domain/keirinRaceData';
import { NarRaceData } from '../domain/narRaceData';
import { GoogleCalendarService } from '../service/implement/googleCalendarService';
import { ICalendarService } from '../service/interface/ICalendarService';
import { MockGoogleCalendarService } from '../service/mock/mockGoogleCalendarService';

// ICalendarServiceの実装クラスをDIコンテナに登錄する
container.register<ICalendarService<NarRaceData>>('NarCalendarService', {
    useFactory: () => {
        switch (process.env.ENV) {
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
        switch (process.env.ENV) {
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
        switch (process.env.ENV) {
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
