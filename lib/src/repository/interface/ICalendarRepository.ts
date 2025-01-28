import type { DeleteCalendarListRequest } from '../request/deleteCalendarListRequest';
import type { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import type { DeleteCalendarListResponse } from '../response/deleteCalendarListResponse';
import type { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';

/**
 * カレンダーリポジトリインターフェース
 */
export interface ICalendarRepository {
    getEvents: (
        request: FetchCalendarListRequest,
    ) => Promise<FetchCalendarListResponse>;

    deleteEvents: (
        request: DeleteCalendarListRequest,
    ) => Promise<DeleteCalendarListResponse>;
}
