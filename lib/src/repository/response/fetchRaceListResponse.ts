import type { IRaceEntity } from '../entity/iRaceEntity';

/**
 * レース一覧取得レスポンス
 */
export class FetchRaceListResponse<R extends IRaceEntity<R>> {
    constructor(public readonly raceEntityList: R[]) {}
}
