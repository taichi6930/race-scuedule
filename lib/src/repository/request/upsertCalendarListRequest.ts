import type { IRaceEntity } from '../entity/iRaceEntity';

export class UpsertCalendarListRequest<R extends IRaceEntity<R>> {
    constructor(public readonly raceEntityList: R[]) {}
}
