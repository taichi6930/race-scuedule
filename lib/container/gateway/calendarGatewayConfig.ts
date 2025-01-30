import { container } from 'tsyringe';

import { GoogleCalendarGateway } from '../../src/gateway/implement/googleCalendarGateway';
import type { ICalendarGateway } from '../../src/gateway/interface/iCalendarGateway';
import { MockGoogleCalendarGateway } from '../../src/gateway/mock/mockGoogleCalendarGateway';
import { ENV } from '../../src/utility/env';

container.register<ICalendarGateway>('WorldGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new GoogleCalendarGateway(
                    process.env.WORLD_CALENDAR_ID ?? '',
                );
            case 'TEST':
                return new GoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
            case 'LOCAL':
                return new MockGoogleCalendarGateway('world');
            default:
                throw new Error('Invalid ENV value');
        }
    },
});

container.register<ICalendarGateway>('NarGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new GoogleCalendarGateway(
                    process.env.NAR_CALENDAR_ID ?? '',
                );
            case 'TEST':
                return new GoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            case 'LOCAL_NO_INIT_DATA':
            case 'LOCAL_INIT_MADE_DATA':
            case 'LOCAL':
                return new MockGoogleCalendarGateway('nar');
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
