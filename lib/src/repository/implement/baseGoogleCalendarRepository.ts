import 'reflect-metadata';

import type { CalendarData } from '../../domain/calendarData';
import type { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import type { RaceEntity } from '../entity/baseEntity';
import type { ICalendarRepository } from '../interface/ICalendarRepository';
import type { DeleteCalendarListRequest } from '../request/deleteCalendarListRequest';
import type { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import type { UpsertCalendarListRequest } from '../request/upsertCalendarListRequest';
import { DeleteCalendarListResponse } from '../response/deleteCalendarListResponse';
import { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';
import { UpsertCalendarListResponse } from '../response/upsertCalendarListResponse';

/**
 * 開催データリポジトリの基底クラス
 */
export abstract class BaseGoogleCalendarRepository<R extends RaceEntity>
    implements ICalendarRepository<R>
{
    protected abstract googleCalendarGateway: ICalendarGateway;
    protected abstract fromGoogleCalendarDataToCalendarData(
        event: object,
    ): CalendarData;

    async getEvents(
        request: FetchCalendarListRequest,
    ): Promise<FetchCalendarListResponse> {
        // GoogleカレンダーAPIからイベントを取得
        try {
            const calendarDataList =
                await this.googleCalendarGateway.fetchCalendarDataList(
                    request.startDate,
                    request.finishDate,
                );
            return new FetchCalendarListResponse(
                calendarDataList.map
                    ? calendarDataList.map((calendarData) =>
                          this.fromGoogleCalendarDataToCalendarData(
                              calendarData,
                          ),
                      )
                    : [],
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
            return new FetchCalendarListResponse([]);
        }
    }

    async upsertEvents(
        request: UpsertCalendarListRequest<R>,
    ): Promise<UpsertCalendarListResponse> {
        // Googleカレンダーから取得する
        await Promise.all(
            request.raceEntityList.map(async (raceEntity) => {
                try {
                    // 既に登録されているかどうか判定
                    let isExist = false;
                    try {
                        await this.googleCalendarGateway
                            .fetchCalendarData(raceEntity.id)
                            .then((calendarData) => {
                                console.debug('calendarData', calendarData);
                                isExist = true;
                            });
                    } catch (error) {
                        console.error(
                            'Google Calendar APIからのイベント取得に失敗しました',
                            error,
                        );
                    }
                    if (isExist) {
                        // 既に登録されている場合は更新
                        await this.googleCalendarGateway.updateCalendarData(
                            raceEntity.toGoogleCalendarData(),
                        );
                    } else {
                        // 新規登録
                        await this.googleCalendarGateway.insertCalendarData(
                            raceEntity.toGoogleCalendarData(),
                        );
                    }
                } catch (error) {
                    console.error(
                        'Google Calendar APIへのイベント登録に失敗しました',
                        error,
                    );
                }
            }),
        );
        return new UpsertCalendarListResponse(200);
    }

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
