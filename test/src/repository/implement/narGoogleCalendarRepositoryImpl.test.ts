import 'reflect-metadata';

import { container } from 'tsyringe';

import type { ICalendarGateway } from '../../../../lib/src/gateway/interface/iCalendarGateway';
import type { NarRaceEntity } from '../../../../lib/src/repository/entity/narRaceEntity';
import { NarGoogleCalendarRepositoryImpl } from '../../../../lib/src/repository/implement/narGoogleCalendarRepositoryImpl';
import { FetchCalendarListRequest } from '../../../../lib/src/repository/request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../../../../lib/src/repository/request/upsertCalendarListRequest';
import {
    baseNarCalendarData,
    baseNarCalendarDataFromGoogleCalendar,
    baseNarRaceEntity,
} from '../../mock/common/baseNarData';
import { mockGoogleCalendarGateway } from '../../mock/gateway/mockGoogleCalendarGateway';

jest.mock('../../../../lib/src/gateway/interface/iCalendarGateway');

describe('NarGoogleCalendarRepositoryImpl', () => {
    let repository: NarGoogleCalendarRepositoryImpl;
    let googleCalendarGateway: jest.Mocked<ICalendarGateway>;

    beforeEach(() => {
        googleCalendarGateway = mockGoogleCalendarGateway();
        container.registerInstance(
            'NarGoogleCalendarGateway',
            googleCalendarGateway,
        );
        repository = container.resolve(NarGoogleCalendarRepositoryImpl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch events successfully', async () => {
        googleCalendarGateway.fetchCalendarDataList.mockResolvedValue([
            baseNarCalendarDataFromGoogleCalendar,
        ]);

        const request = new FetchCalendarListRequest(
            new Date('2023-01-01'),
            new Date('2023-12-31'),
        );
        const calendarDataList = await repository.getEvents(request);

        expect(calendarDataList).toHaveLength(1);
        expect(calendarDataList[0]).toEqual(baseNarCalendarData);
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

        const response = await repository.deleteEvents([baseNarCalendarData]);

        // レスポンスが200で帰ってくることを確認
        expect(response.code).toEqual(200);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('should handle error when deleting events', async () => {
        googleCalendarGateway.deleteCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        await repository.deleteEvents([baseNarCalendarData]);
        expect(googleCalendarGateway.deleteCalendarData).toHaveBeenCalled();
    });

    it('should insert events successfully', async () => {
        googleCalendarGateway.fetchCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        const request = new UpsertCalendarListRequest<NarRaceEntity>([
            baseNarRaceEntity,
        ]);
        const response = await repository.upsertEvents(request);

        // レスポンスが200で返ってくることを確認
        expect(response.code).toEqual(200);
        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });

    it('should update events successfully', async () => {
        googleCalendarGateway.fetchCalendarData.mockResolvedValue(
            baseNarCalendarDataFromGoogleCalendar,
        );

        const request = new UpsertCalendarListRequest<NarRaceEntity>([
            baseNarRaceEntity,
        ]);
        const response = await repository.upsertEvents(request);

        // レスポンスが200で返ってくることを確認
        expect(response.code).toEqual(200);
        expect(googleCalendarGateway.updateCalendarData).toHaveBeenCalled();
    });

    it('should handle error when upserting events', async () => {
        googleCalendarGateway.insertCalendarData.mockRejectedValue(
            new Error('API Error'),
        );

        const request = new UpsertCalendarListRequest<NarRaceEntity>([
            baseNarRaceEntity,
        ]);

        await repository.upsertEvents(request);
        expect(googleCalendarGateway.insertCalendarData).toHaveBeenCalled();
    });
});
