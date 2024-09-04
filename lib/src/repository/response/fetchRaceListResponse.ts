export class FetchRaceListResponse<R> {
    constructor(
        public readonly raceDataList: R[],
    ) { }
}