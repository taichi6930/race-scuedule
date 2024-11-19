import { baseBoatraceRacePlayerData } from '../mock/common/baseData';

describe('BoatraceRacePlayerDataクラスのテスト', () => {
    /**
     * テスト用のBoatraceRacePlayerDataインスタンス
     */
    const baseRacePlayerData = baseBoatraceRacePlayerData;

    it('正しい入力でBoatraceRacePlayerDataのインスタンスを作成できることを確認', () => {
        const racePlayerData = baseRacePlayerData;
        // インスタンスのプロパティが正しいか確認
        expect(racePlayerData.positionNumber).toBe(1);
        expect(racePlayerData.playerNumber).toBe(10000);
    });

    it('何も変更せずBoatraceRacePlayerDataのインスタンスを作成できることを確認', () => {
        const racePlayerData = baseRacePlayerData;
        const newRacePlayerData = racePlayerData.copy();
        // インスタンスが変更されていないか確認
        expect(newRacePlayerData).toEqual(racePlayerData);
    });

    it('レース番号が範囲外の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRacePlayerData.copy({ positionNumber: 13 });
        }).toThrow('枠番は1以上6以下である必要があります');
    });
});
