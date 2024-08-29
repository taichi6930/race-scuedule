export class RegisterRaceListRequest<R> {
    constructor(
        // レースデータ
        public readonly raceDataList: R[],
    ) {
    }
}