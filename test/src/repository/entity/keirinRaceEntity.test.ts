import {
    baseKeirinRaceData,
    baseKeirinRaceEntity,
} from '../../mock/common/baseData';

describe('KeirinRaceEntityクラスのテスト', () => {
    it('正しい入力でKeirinRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseKeirinRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.raceData).toBe(baseKeirinRaceData);
    });

    it('何も変更せずKeirinRaceEntityのインスタンスを作成できることを確認', () => {
        const newRaceEntity = baseKeirinRaceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity.id).toEqual(baseKeirinRaceEntity.id);
        expect(newRaceEntity.raceData).toBe(baseKeirinRaceData);
    });

    it('何も変更せずKeirinRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseKeirinRaceEntity.toDomainData();
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseKeirinRaceData);
    });
});
