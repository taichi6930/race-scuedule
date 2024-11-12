import {
    baseAutoraceRaceData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseData';

describe('AutoraceRaceEntityクラスのテスト', () => {
    /**
     * テスト用のAutoraceRaceEntityインスタンス
     */
    const baseRaceEntity = baseAutoraceRaceEntity;

    it('正しい入力でAutoraceRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('autorace202412310511');
        expect(raceEntity.name).toBe('スーパースター王座決定戦');
        expect(raceEntity.dateTime).toEqual(new Date('2024-12-31 16:30'));
        expect(raceEntity.stage).toBe('優勝戦');
        expect(raceEntity.location).toBe('飯塚');
        expect(raceEntity.grade).toBe('SG');
        expect(raceEntity.number).toBe(11);
    });

    it('何も変更せずAutoraceRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const newRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity).toEqual(raceEntity);
    });

    it('何も変更せずAutoraceRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const raceData = raceEntity.toDomainData();
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseAutoraceRaceData);
    });
});
