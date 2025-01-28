import type { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import type { FetchCalendarListResponse } from '../request/fetchCalendarListResponse';

/**
 * カレンダーリポジトリインターフェース
 */
export interface ICalendarRepository {
    getEvents: (
        request: FetchCalendarListRequest,
    ) => Promise<FetchCalendarListResponse>;
}
