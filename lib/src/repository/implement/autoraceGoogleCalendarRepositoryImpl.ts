import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { Logger } from '../../utility/logger';
import { AutoraceRaceEntity } from '../entity/autoraceRaceEntity';
import { FetchCalendarListRequest } from '../request/fetchCalendarListRequest';
import { UpsertCalendarListRequest } from '../request/upsertCalendarListRequest';
import { FetchCalendarListResponse } from '../response/fetchCalendarListResponse';
import { UpsertCalendarListResponse } from '../response/upsertCalendarListResponse';
import { BaseGoogleCalendarRepository } from './baseGoogleCalendarRepository';
/**
 * オートレース場開催データリポジトリの実装
 */
@injectable()
export class AutoraceGoogleCalendarRepositoryImpl extends BaseGoogleCalendarRepository<AutoraceRaceEntity> {
    constructor(
        @inject('AutoraceGoogleCalendarGateway')
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
                          AutoraceRaceEntity.fromGoogleCalendarDataToCalendarData(
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
        request: UpsertCalendarListRequest<AutoraceRaceEntity>,
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
}
