import 'reflect-metadata';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { WorldRaceId } from '../../utility/data/world/worldRaceId';
import { Logger } from '../../utility/logger';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import { ICalendarRepository } from '../interface/ICalendarRepository';
import { DeleteCalendarListRequest } from '../request/deleteCalendarListRequest';
import { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../request/upsertCalendarListRequest';
import { DeleteCalendarListResponse } from '../response/deleteCalendarListResponse';
import { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';
import { UpsertCalendarListResponse } from '../response/upsertCalendarListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class WorldGoogleCalendarRepositoryImpl
    implements ICalendarRepository<WorldRaceEntity>
{
    constructor(
        @inject('WorldGoogleCalendarGateway')
        private readonly googleCalendarGateway: ICalendarGateway,
    ) {}
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
                          WorldRaceEntity.fronGoogleCalendarDataToCalendarData(
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

    @Logger
    async upsertEvents(
        request: UpsertCalendarListRequest<WorldRaceEntity>,
    ): Promise<UpsertCalendarListResponse> {
        const calendarIdMap = new Map<string, WorldRaceId[]>();
        await Promise.all(
            request.raceEntityList.map(async (raceEntity) => {
                // keyに日付（yyyyMMdd）が存在する場合は追加
                if (
                    calendarIdMap.has(
                        format(raceEntity.raceData.dateTime, 'yyyyMMdd'),
                    )
                ) {
                    return;
                }
                // カレンダーListを取得
                const calendarIdList = (
                    await this.googleCalendarGateway.fetchCalendarDataList(
                        new Date(
                            raceEntity.raceData.dateTime.getFullYear(),
                            raceEntity.raceData.dateTime.getMonth(),
                            raceEntity.raceData.dateTime.getDate(),
                        ),
                        new Date(
                            raceEntity.raceData.dateTime.getFullYear(),
                            raceEntity.raceData.dateTime.getMonth(),
                            raceEntity.raceData.dateTime.getDate() + 1,
                        ),
                    )
                )
                    .map((event) => event.id)
                    .filter((id) => id !== undefined && id !== null);

                // カレンダーIDをMapに格納
                calendarIdMap.set(
                    format(raceEntity.raceData.dateTime, 'yyyyMMdd'),
                    calendarIdList,
                );

                // 既に登録されているかどうか判定
                const isExist = calendarIdMap
                    .get(format(raceEntity.raceData.dateTime, 'yyyyMMdd'))
                    ?.some((id) => raceEntity.id.includes(id));

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
            }),
        );
        return new UpsertCalendarListResponse(200);
    }

    deleteEvents: (
        request: DeleteCalendarListRequest,
    ) => Promise<DeleteCalendarListResponse>;
}
