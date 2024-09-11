import { JraRaceData } from '../../../lib/src/domain/jraRaceData';

describe('JraRaceDataクラスのテスト', () => {
    /**
     * テスト用のJraRaceDataインスタンス
     */
    const baseRaceData = new JraRaceData(
        '東京優駿',
        new Date('2024-05-26 15:40'),
        '東京',
        '芝',
        2400,
        'GⅠ',
        10,
        1,
        1,
    );

    it('正しい入力でJraRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        // インスタンスのプロパティが正しいか確認
        expect(raceData.name).toBe('東京優駿');
        expect(raceData.dateTime).toEqual(new Date('2024-05-26 15:40'));
        expect(raceData.location).toBe('東京');
        expect(raceData.surfaceType).toBe('芝');
        expect(raceData.distance).toBe(2400);
        expect(raceData.grade).toBe('GⅠ');
        expect(raceData.number).toBe(10);
        expect(raceData.heldTimes).toBe(1);
        expect(raceData.heldDayTimes).toBe(1);
    });

    it('何も変更せずJraRaceDataのインスタンスを作成できることを確認', () => {
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

    it('開催回数が1未満の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRaceData.copy({ heldTimes: 0 });
        })
            // エラーメッセージがあっているか確認
            .toThrow('開催回数は1以上である必要があります');
    });

    it('開催日数が1未満の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRaceData.copy({ heldDayTimes: 0 });
        }).toThrow('開催日数は1以上である必要があります');
    });
});
