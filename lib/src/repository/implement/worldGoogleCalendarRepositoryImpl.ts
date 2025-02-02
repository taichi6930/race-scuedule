import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { Logger } from '../../utility/logger';
import { generateWorldRaceId } from '../../utility/raceId';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../request/upsertCalendarListRequest';
import { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';
import { UpsertCalendarListResponse } from '../response/upsertCalendarListResponse';
import { BaseGoogleCalendarRepository } from './baseGoogleCalendarRepository';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class WorldGoogleCalendarRepositoryImpl extends BaseGoogleCalendarRepository<WorldRaceEntity> {
    constructor(
        @inject('WorldGoogleCalendarGateway')
        protected readonly googleCalendarGateway: ICalendarGateway,
    ) {
        super();
    }
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
                          WorldRaceEntity.fromGoogleCalendarDataToCalendarData(
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
        // Googleカレンダーから取得する
        await Promise.all(
            request.raceEntityList.map(async (raceEntity) => {
                try {
                    // 既に登録されているかどうか判定
                    let isExist = false;
                    try {
                        const calendarData =
                            await this.googleCalendarGateway.fetchCalendarData(
                                this.generateEventId(raceEntity),
                            );
                        console.debug('calendarData', calendarData);
                        isExist = true;
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

    /**
     * イベントIDを生成する
     * netkeiba、netkeirinのレースIDを元に生成
     * @param raceEntity
     * @returns
     */
    private generateEventId(raceEntity: WorldRaceEntity): string {
        // w, x, y, zはGoogle Calendar APIのIDで使用できないため、置換
        // https://developers.google.com/calendar/api/v3/reference/events/insert?hl=ja
        return generateWorldRaceId(
            raceEntity.raceData.dateTime,
            raceEntity.raceData.location,
            raceEntity.raceData.number,
        )
            .replace('w', 'vv')
            .replace('x', 'cs')
            .replace('y', 'v')
            .replace('z', 's');
    }
}
