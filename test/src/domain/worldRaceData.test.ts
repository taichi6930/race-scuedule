import { WorldRaceData } from '../../../lib/src/domain/worldRaceData';

describe('WorldRaceDataクラスのテスト', () => {
    /**
     * テスト用のWorldRaceDataインスタンス
     */
    const baseRaceData = new WorldRaceData(
        '凱旋門賞',
        new Date('2024-10-02 16:30'),
        'パリロンシャン',
        '芝',
        2400,
        'GⅠ',
        11,
    );

    it('正しい入力でWorldRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        // インスタンスのプロパティが正しいか確認
        expect(raceData.name).toBe('凱旋門賞');
        expect(raceData.dateTime).toEqual(new Date('2024-10-02 16:30'));
        expect(raceData.location).toBe('パリロンシャン');
        expect(raceData.surfaceType).toBe('芝');
        expect(raceData.distance).toBe(2400);
        expect(raceData.grade).toBe('GⅠ');
        expect(raceData.number).toBe(11);
    });

    it('何も変更せずWorldRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const newRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceData).toEqual(raceData);
    });

    it('距離が範囲外の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRaceData.copy({ distance: -1 });
        }).toThrow('距離は0より大きい必要があります');
    });
});
