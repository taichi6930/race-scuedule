import type { RaceEntity } from '../entity/baseEntity';
import type { DeleteCalendarListRequest } from '../request/deleteCalendarListRequest';
import type { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import type { UpsertCalendarListRequest } from '../request/upsertCalendarListRequest';
import type { DeleteCalendarListResponse } from '../response/deleteCalendarListResponse';
import type { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';
import type { UpsertCalendarListResponse } from '../response/upsertCalendarListResponse';

/**
 * カレンダーリポジトリインターフェース
 */
export interface ICalendarRepository<R extends RaceEntity, C> {
    getEvents: (
        request: FetchCalendarListRequest,
    ) => Promise<FetchCalendarListResponse<C>>;

    upsertEvents: (
        request: UpsertCalendarListRequest<R>,
    ) => Promise<UpsertCalendarListResponse>;

    deleteEvents: (
        request: DeleteCalendarListRequest,
    ) => Promise<DeleteCalendarListResponse>;
}
