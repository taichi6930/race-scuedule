import { container } from 'tsyringe';

import { GoogleCalendarGateway } from '../../src/gateway/implement/googleCalendarGateway';
import { MockGoogleCalendarGateway } from '../../src/gateway/mock/mockGoogleCalendarGateway';
import { ENV } from '../../src/utility/env';

// JraGoogleCalendarGateway
container.register('JraGoogleCalendarGateway', {
    useFactory: () => {
        switch (ENV) {
            case 'PRODUCTION':
                return new GoogleCalendarGateway(
                    process.env.JRA_CALENDAR_ID ?? '',
                );
            case 'TEST':
                return new GoogleCalendarGateway(
                    process.env.TEST_CALENDAR_ID ?? '',
                );
            case 'LOCAL':
                return new MockGoogleCalendarGateway(
                    process.env.JRA_CALENDAR_ID ?? '',
                );
            default:
                throw new Error('Invalid ENV value');
        }
    },
});
