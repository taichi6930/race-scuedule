import { baseNarRaceData, baseNarRaceEntity } from '../../mock/common/baseData';

describe('NarRaceEntityクラスのテスト', () => {
    /**
     * テスト用のNarRaceEntityインスタンス
     */
    const baseRaceEntity = baseNarRaceEntity;

    it('正しい入力でNarRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('nar202406034411');
        expect(raceEntity.raceData).toBe(baseNarRaceData);
    });

    it('何も変更せずNarRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const newRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity.id).toEqual(raceEntity.id);
        expect(newRaceEntity.raceData).toBe(raceEntity.raceData);
    });

    it('何も変更せずNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const raceData = raceEntity.toDomainData();
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseNarRaceData);
    });
});
