import { baseNarRaceData } from '../mock/common/baseNarData';

describe('NarRaceDataクラスのテスト', () => {
    const baseRaceData = baseNarRaceData;

    it('正しい入力でNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        expect(raceData.name).toBe('東京大賞典');
        expect(raceData.dateTime).toEqual(new Date('2024-12-29 15:40'));
        expect(raceData.location).toBe('大井');
        expect(raceData.surfaceType).toBe('ダート');
        expect(raceData.distance).toBe(2000);
        expect(raceData.grade).toBe('GⅠ');
        expect(raceData.number).toBe(11);
    });

    it('何も変更せずNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const newRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceData).toEqual(raceData);
    });

    it('距離が0または負の値の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRaceData.copy({ distance: 0 });
        }).toThrow('距離は0より大きい必要があります');
    });

    it('レース番号が範囲外の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRaceData.copy({ number: 13 });
        }).toThrow('レース番号は1以上12以下である必要があります');
    });
});
