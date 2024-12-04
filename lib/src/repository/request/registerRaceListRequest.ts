import type { RaceEntity } from '../entity/baseEntity';

/**
 * レースリスト登録リクエスト
 */
export class RegisterRaceListRequest<R extends RaceEntity> {
    constructor(
        // レースデータ
        public readonly raceEntityList: R[],
    ) {}
}
