import type { RaceEntity } from '../entity/baseEntity';

/**
 * レース一覧取得レスポンス
 */
export class FetchRaceListResponse<R extends RaceEntity> {
    constructor(public readonly raceDataList: R[]) {}
}
