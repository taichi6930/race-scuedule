import {
    baseBoatraceRaceData,
    baseBoatraceRaceEntity,
} from '../../mock/common/baseData';

describe('BoatraceRaceEntityクラスのテスト', () => {
    it('正しい入力でBoatraceRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseBoatraceRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.raceData).toBe(baseBoatraceRaceData);
    });

    it('何も変更せずBoatraceRaceEntityのインスタンスを作成できることを確認', () => {
        const newRaceEntity = baseBoatraceRaceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity.id).toEqual(baseBoatraceRaceEntity.id);
        expect(newRaceEntity.raceData).toBe(baseBoatraceRaceData);
    });

    it('何も変更せずBoatraceRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseBoatraceRaceEntity.toDomainData();
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseBoatraceRaceData);
    });
});
