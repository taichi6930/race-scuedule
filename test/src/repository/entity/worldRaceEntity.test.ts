import {
    baseWorldRaceData,
    baseWorldRaceEntity,
} from '../../mock/common/baseData';

describe('WorldRaceEntityクラスのテスト', () => {
    /**
     * テスト用のWorldRaceEntityインスタンス
     */
    const baseRaceEntity = baseWorldRaceEntity;

    it('正しい入力でWorldRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('world20241001longchamp11');
        expect(raceEntity.name).toBe('凱旋門賞');
        expect(raceEntity.dateTime).toEqual(new Date('2024-10-01 16:30'));
        expect(raceEntity.location).toBe('パリロンシャン');
        expect(raceEntity.distance).toBe(2400);
        expect(raceEntity.surfaceType).toBe('芝');
        expect(raceEntity.grade).toBe('GⅠ');
        expect(raceEntity.number).toBe(11);
    });

    it('何も変更せずWorldRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const newRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity).toEqual(raceEntity);
    });

    it('何も変更せずWorldRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const raceData = raceEntity.toDomainData();
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseWorldRaceData);
    });
});
