import { baseJraRaceData, baseJraRaceEntity } from '../../mock/common/baseData';

describe('JraRaceEntityクラスのテスト', () => {
    /**
     * テスト用のJraRaceEntityインスタンス
     */
    const baseRaceEntity = baseJraRaceEntity;

    it('正しい入力でJraRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('jra202412220611');
        expect(raceEntity.name).toBe('有馬記念');
        expect(raceEntity.dateTime).toEqual(new Date('2024-12-22 15:40'));
        expect(raceEntity.location).toBe('中山');
        expect(raceEntity.distance).toBe(2500);
        expect(raceEntity.surfaceType).toBe('芝');
        expect(raceEntity.grade).toBe('GⅠ');
        expect(raceEntity.number).toBe(11);
    });

    it('何も変更せずJraRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const newRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity).toEqual(raceEntity);
    });

    it('何も変更せずJraRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const raceData = raceEntity.toDomainData();
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseJraRaceData);
    });
});
