import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../src/gateway/interface/iCalendarGateway';
import { MockGoogleCalendarGateway } from '../../src/gateway/mock/mockGoogleCalendarGateway';
import { ENV } from '../../src/utility/env';

container.register<ICalendarGateway>('WorldGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new MockGoogleCalendarGateway('world');
            case 'LOCAL':
                return new MockGoogleCalendarGateway('world');
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
