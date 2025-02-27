import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { AutoraceRaceEntity } from '../entity/autoraceRaceEntity';
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

    protected fromGoogleCalendarDataToCalendarData(
        event: object,
    ): CalendarData {
        return AutoraceRaceEntity.fromGoogleCalendarDataToCalendarData(event);
    }
}
