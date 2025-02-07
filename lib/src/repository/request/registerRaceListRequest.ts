import type { IRaceEntity } from '../entity/iRaceEntity';

/**
 * レースリスト登録リクエスト
 */
export class RegisterRaceListRequest<R extends IRaceEntity<R>> {
    constructor(
        // レースデータ
        public readonly raceEntityList: R[],
    ) {}
}
