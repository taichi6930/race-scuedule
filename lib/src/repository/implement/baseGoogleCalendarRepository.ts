import 'reflect-metadata';

import type { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import type { RaceEntity } from '../entity/baseEntity';
import type { ICalendarRepository } from '../interface/ICalendarRepository';
import type { DeleteCalendarListRequest } from '../request/deleteCalendarListRequest';
import type { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import type { UpsertCalendarListRequest } from '../request/upsertCalendarListRequest';
import { DeleteCalendarListResponse } from '../response/deleteCalendarListResponse';
import type { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';
import type { UpsertCalendarListResponse } from '../response/upsertCalendarListResponse';

/**
 * 開催データリポジトリの基底クラス
 */
export abstract class BaseGoogleCalendarRepository<R extends RaceEntity>
    implements ICalendarRepository<R>
{
    protected abstract googleCalendarGateway: ICalendarGateway;

    abstract getEvents(
        request: FetchCalendarListRequest,
    ): Promise<FetchCalendarListResponse>;

    abstract upsertEvents(
        request: UpsertCalendarListRequest<R>,
    ): Promise<UpsertCalendarListResponse>;

    async deleteEvents(
        request: DeleteCalendarListRequest,
    ): Promise<DeleteCalendarListResponse> {
        await Promise.all(
            request.calendarDataList.map(async (calendarData) => {
                try {
                    await this.googleCalendarGateway.deleteCalendarData(
                        calendarData.id,
                    );
                } catch (error) {
                    console.error(
                        'Google Calendar APIからのイベント削除に失敗しました',
                        error,
                    );
                }
            }),
        );
        return new DeleteCalendarListResponse(200);
    }
}
