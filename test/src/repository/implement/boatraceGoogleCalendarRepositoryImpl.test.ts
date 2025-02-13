import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../../../lib/src/gateway/interface/iCalendarGateway';
import { BoatraceGoogleCalendarRepositoryImpl } from '../../../../lib/src/repository/implement/boatraceGoogleCalendarRepositoryImpl';
import { FetchCalendarListRequest } from '../../../../lib/src/repository/request/fetchCalendarListRequest';
import {
    baseBoatraceCalendarData,
    baseBoatraceCalendarDataFromGoogleCalendar,
    baseBoatraceRaceEntity,
} from '../../mock/common/baseBoatraceData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

jest.mock('../../../../lib/src/gateway/interface/iCalendarGateway');

describe('BoatraceGoogleCalendarRepositoryImpl', () => {
    let repository: BoatraceGoogleCalendarRepositoryImpl;
    let googleCalendarGateway: jest.Mocked<ICalendarGateway>;

    beforeEach(() => {
        googleCalendarGateway = mockGoogleCalendarGateway();
        container.registerInstance(
            'BoatraceGoogleCalendarGateway',
            googleCalendarGateway,
        );
        repository = container.resolve(BoatraceGoogleCalendarRepositoryImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch events successfully', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockResolvedValue([
            baseBoatraceCalendarDataFromGoogleCalendar,
        ]);

        const request = new FetchCalendarListRequest(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(request);

        expect(calendarDataList).toHaveLength(1);
        expect(calendarDataList[0]).toEqual(baseBoatraceCalendarData);
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

        await repository.deleteEvents([baseBoatraceCalendarData]);

        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('should handle error when deleting events', async () => {
        googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.deleteEvents([baseBoatraceCalendarData]);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('should insert events successfully', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseBoatraceRaceEntity]);

        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });

    it('should update events successfully', async () => {
        googleCalendarGateway.fetchCalendarData.mockResolvedValue(
            baseBoatraceCalendarDataFromGoogleCalendar,
        );

        await repository.upsertEvents([baseBoatraceRaceEntity]);

        expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
    });

    it('should handle error when upserting events', async () => {
        googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.upsertEvents([baseBoatraceRaceEntity]);
        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });
});
