import type { RaceEntity } from '../entity/baseEntity';

export class UpsertCalendarListRequest<R extends RaceEntity> {
    constructor(public readonly raceEntityList: R[]) {}
}
