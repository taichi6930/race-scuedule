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
        expect(raceEntity.name).toBe('東京ダービー');
        expect(raceEntity.dateTime).toEqual(new Date('2024-06-03 20:10'));
        expect(raceEntity.location).toBe('大井');
        expect(raceEntity.distance).toBe(2000);
        expect(raceEntity.surfaceType).toBe('ダート');
        expect(raceEntity.grade).toBe('JpnⅠ');
        expect(raceEntity.number).toBe(11);
    });

    it('何も変更せずNarRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const newRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity).toEqual(raceEntity);
    });

    it('何も変更せずNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const raceData = raceEntity.toDomainData();
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseNarRaceData);
    });
});
