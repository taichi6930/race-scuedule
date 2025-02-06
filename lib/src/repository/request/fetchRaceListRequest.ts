import type { IPlaceEntity } from '../entity/iPlaceEntity';

/**
 * レース一覧取得リクエスト
 */
export class FetchRaceListRequest<P extends IPlaceEntity<P>> {
    constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly placeEntityList?: P[],
    ) {}
}
