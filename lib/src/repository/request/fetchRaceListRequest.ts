import type { PlaceEntity } from '../entity/baseEntity';

/**
 * レース一覧取得リクエスト
 */
export class FetchRaceListRequest<P extends PlaceEntity> {
    constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly placeDataList?: P[],
    ) {}
}
