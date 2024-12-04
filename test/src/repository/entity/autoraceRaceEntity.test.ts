import {
    baseAutoraceRaceData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseData';

describe('AutoraceRaceEntityクラスのテスト', () => {
    it('正しい入力でAutoraceRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseAutoraceRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.raceData).toBe(baseAutoraceRaceData);
    });

    it('何も変更せずAutoraceRaceEntityのインスタンスを作成できることを確認', () => {
        const newRaceEntity = baseAutoraceRaceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity.id).toEqual(baseAutoraceRaceEntity.id);
        expect(newRaceEntity.raceData).toBe(baseAutoraceRaceData);
    });

    it('何も変更せずAutoraceRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseAutoraceRaceEntity.raceData;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseAutoraceRaceData);
    });
});
