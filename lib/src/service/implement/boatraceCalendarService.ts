import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { BaseCalendarService } from './baseCalendarService';

@injectable()
export class BoatraceCalendarService extends BaseCalendarService<BoatraceRaceEntity> {
    constructor(
        @inject('BoatraceCalendarRepository')
        protected readonly calendarRepository: ICalendarRepository<BoatraceRaceEntity>,
    ) {
        super();
    }
}
