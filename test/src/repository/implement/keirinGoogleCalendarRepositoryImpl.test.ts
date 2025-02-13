import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../../../lib/src/gateway/interface/iCalendarGateway';
import { KeirinGoogleCalendarRepositoryImpl } from '../../../../lib/src/repository/implement/keirinGoogleCalendarRepositoryImpl';
import { FetchCalendarListRequest } from '../../../../lib/src/repository/request/fetchCalendarListRequest';
import {
    baseKeirinCalendarData,
    baseKeirinCalendarDataFromGoogleCalendar,
    baseKeirinRaceEntity,
} from '../../mock/common/baseKeirinData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

jest.mock('../../../../lib/src/gateway/interface/iCalendarGateway');

describe('KeirinGoogleCalendarRepositoryImpl', () => {
    let repository: KeirinGoogleCalendarRepositoryImpl;
    let googleCalendarGateway: jest.Mocked<ICalendarGateway>;

    beforeEach(() => {
        googleCalendarGateway = mockGoogleCalendarGateway();
        container.registerInstance(
            'KeirinGoogleCalendarGateway',
            googleCalendarGateway,
        );
        repository = container.resolve(KeirinGoogleCalendarRepositoryImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch events successfully', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockResolvedValue([
            baseKeirinCalendarDataFromGoogleCalendar,
        ]);

        const request = new FetchCalendarListRequest(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(request);

        expect(calendarDataList).toHaveLength(1);
        expect(calendarDataList[0]).toEqual(baseKeirinCalendarData);
        expect(googleCalendarGateway.fetchCalendarDataList).toHaveBeenCalled();
    });

    it('should handle error when fetching events', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockRejectedValue(
            new Error('API Error'),
        );

        const request = new FetchCalendarListRequest(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(request);

        expect(calendarDataList).toHaveLength(0);
        expect(googleCalendarGateway.fetchCalendarDataList).toHaveBeenCalled();
    });

    it('should delete events successfully', async () => {
        googleCalendarGateway.deleteCalendarData.mockResolvedValue();

        await repository.deleteEvents([baseKeirinCalendarData]);

        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('should handle error when deleting events', async () => {
        googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.deleteEvents([baseKeirinCalendarData]);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('should insert events successfully', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseKeirinRaceEntity]);

        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });

    it('should update events successfully', async () => {
        googleCalendarGateway.fetchCalendarData.mockResolvedValue(
            baseKeirinCalendarDataFromGoogleCalendar,
        );

        await repository.upsertEvents([baseKeirinRaceEntity]);

        expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
    });

    it('should handle error when upserting events', async () => {
        googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseKeirinRaceEntity]);
        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });
});
