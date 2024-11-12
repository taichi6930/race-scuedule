import {
    baseKeirinRaceData,
    baseKeirinRaceEntity,
} from '../../mock/common/baseData';

describe('KeirinRaceEntityクラスのテスト', () => {
    /**
     * テスト用のKeirinRaceEntityインスタンス
     */
    const baseRaceEntity = baseKeirinRaceEntity;

    it('正しい入力でKeirinRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('keirin202512303511');
        expect(raceEntity.name).toBe('KEIRINグランプリ');
        expect(raceEntity.dateTime).toEqual(new Date('2025-12-30 16:30'));
        expect(raceEntity.stage).toBe('グランプリ');
        expect(raceEntity.location).toBe('平塚');
        expect(raceEntity.grade).toBe('GP');
        expect(raceEntity.number).toBe(11);
    });

    it('何も変更せずKeirinRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const newRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity).toEqual(raceEntity);
    });

    it('何も変更せずKeirinRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const raceData = raceEntity.toDomainData();
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseKeirinRaceData);
    });
});
